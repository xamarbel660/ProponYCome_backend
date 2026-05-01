const { GoogleGenAI } = require('@google/genai')
const { logMensaje } = require('../utils/logger.js')

// Variables de configuración de IA
const IA_TOKEN = process.env.IA_API_TOKEN
const IA_MODEL = process.env.IA_MODEL
const IA_MODELOS_FALLBACK = (process.env.IA_MODELOS_FALLBACK || '')
  .split(',')
  .map((m) => m.trim())
  .filter(Boolean)
const IA_MAX_REINTENTOS = Number.parseInt(process.env.IA_MAX_REINTENTOS || '2', 10)
const IA_BACKOFF_BASE_MS = Number.parseInt(process.env.IA_BACKOFF_BASE_MS || '800', 10)
const IA_MODELOS_POR_DEFECTO = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.5-pro']

function normalizarEntero (value, defaultValue, min) {
  if (Number.isNaN(value) || value < min) return defaultValue
  return value
}

const MAX_REINTENTOS = normalizarEntero(IA_MAX_REINTENTOS, 2, 0)
const BACKOFF_BASE_MS = normalizarEntero(IA_BACKOFF_BASE_MS, 800, 100)

// Esta clasificacion decide si conviene reintentar la misma peticion.
function esErrorTemporalIA (error) {
  const status = Number(error?.status || error?.error?.code)
  const providerStatus = error?.error?.status
  const mensaje = String(error?.message || '').toLowerCase()

  return [408, 429, 500, 502, 503, 504].includes(status) ||
    providerStatus === 'UNAVAILABLE' ||
    providerStatus === 'RESOURCE_EXHAUSTED' ||
    mensaje.includes('deadline exceeded') ||
    mensaje.includes('timeout') ||
    mensaje.includes('temporarily unavailable')
}

// Si el modelo no existe o no soporta la operacion, pasamos al siguiente candidato.
function esErrorModeloNoDisponible (error) {
  const status = Number(error?.status || error?.error?.code)
  const providerStatus = error?.error?.status
  const mensaje = String(error?.message || '').toLowerCase()

  return status === 404 ||
    providerStatus === 'NOT_FOUND' ||
    mensaje.includes('not found for api version') ||
    mensaje.includes('not supported for generatecontent') ||
    mensaje.includes('model not found')
}

// Errores de permisos/token: no tiene sentido reintentar sin cambiar credenciales.
function esErrorAutenticacionIA (error) {
  const status = Number(error?.status || error?.error?.code)
  const providerStatus = error?.error?.status
  const mensaje = String(error?.message || '').toLowerCase()

  return status === 401 ||
    status === 403 ||
    providerStatus === 'UNAUTHENTICATED' ||
    providerStatus === 'PERMISSION_DENIED' ||
    mensaje.includes('api key not valid')
}

function crearErrorServicioIA (mensaje, status, cause) {
  const error = new Error(mensaje)
  error.status = status
  error.cause = cause
  return error
}

async function generarConModelo (ai, model, instrucciones) {
  return ai.models.generateContent({
    model,
    contents: instrucciones,
    config: {
      responseMimeType: 'application/json',
      systemInstruction: 'Eres un chef experto.'
    }
  })
}

function construirModelosCandidatos () {
  // Orden de prioridad: principal -> fallback del .env -> defaults seguros.
  return [IA_MODEL, ...IA_MODELOS_FALLBACK, ...IA_MODELOS_POR_DEFECTO]
    .map((modelo) => String(modelo || '').trim())
    .filter((modelo, index, arr) => modelo && arr.indexOf(modelo) === index)
}

function esperar (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function generarConModeloConReintentos (ai, model, instrucciones) {
  let ultimoError = null

  // Intento 1 + N reintentos con backoff exponencial para picos temporales del proveedor.
  for (let intento = 1; intento <= MAX_REINTENTOS + 1; intento++) {
    try {
      return await generarConModelo(ai, model, instrucciones)
    } catch (error) {
      ultimoError = error

      if (esErrorModeloNoDisponible(error) || esErrorAutenticacionIA(error)) {
        throw error
      }

      if (!esErrorTemporalIA(error) || intento > MAX_REINTENTOS) {
        throw error
      }

      const jitter = Math.floor(Math.random() * 250)
      const backoffMs = BACKOFF_BASE_MS * (2 ** (intento - 1)) + jitter
      await esperar(backoffMs)
    }
  }

  throw ultimoError
}

function extraerTextoRespuesta (response) {
  if (typeof response?.text === 'string') {
    return response.text
  }

  if (typeof response?.text === 'function') {
    try {
      return response.text()
    } catch {
      return ''
    }
  }

  const parts = response?.candidates?.[0]?.content?.parts
  if (!Array.isArray(parts)) return ''

  return parts
    .map((part) => (typeof part?.text === 'string' ? part.text : ''))
    .join('\n')
    .trim()
}

function parsearJsonCandidato (candidato) {
  if (!candidato) return null

  let parseado = JSON.parse(candidato)
  if (typeof parseado === 'string') {
    parseado = JSON.parse(parseado)
  }

  return parseado
}

function extraerPayloadJson (textoRespuesta) {
  const texto = String(textoRespuesta || '').trim()
  if (!texto) return null

  const sinBloques = texto
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/, '')
    .trim()

  const candidatos = [sinBloques]

  // Probamos varios formatos frecuentes del proveedor: bloque markdown, objeto suelto o array suelto.
  const matchBloque = texto.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
  if (matchBloque?.[1]) {
    candidatos.push(matchBloque[1].trim())
  }

  const primerIndexObjeto = sinBloques.indexOf('{')
  const ultimoIndexObjeto = sinBloques.lastIndexOf('}')
  if (primerIndexObjeto !== -1 && ultimoIndexObjeto > primerIndexObjeto) {
    candidatos.push(sinBloques.slice(primerIndexObjeto, ultimoIndexObjeto + 1))
  }

  const primerIndexArray = sinBloques.indexOf('[')
  const ultimoIndexArray = sinBloques.lastIndexOf(']')
  if (primerIndexArray !== -1 && ultimoIndexArray > primerIndexArray) {
    candidatos.push(`{"recetas":${sinBloques.slice(primerIndexArray, ultimoIndexArray + 1)}}`)
  }

  const candidatosUnicos = candidatos.filter((candidato, index, arr) => candidato && arr.indexOf(candidato) === index)
  for (const candidato of candidatosUnicos) {
    try {
      return parsearJsonCandidato(candidato)
    } catch {
      continue
    }
  }

  return null
}

function crearIngrediente (nombre, cantidad, unidad) {
  return {
    nombre_ingrediente: nombre,
    cantidad,
    unidad
  }
}

function construirRecetasFallback (ingredientesUsuario) {
  // Respuesta de seguridad para no dejar al cliente sin recetas si IA falla.
  const ingredientes = Array.isArray(ingredientesUsuario)
    ? ingredientesUsuario.map((ing) => String(ing).trim()).filter(Boolean)
    : []

  const ingredientePrincipal = ingredientes[0] || 'huevo'
  const ingredienteSecundario = ingredientes[1] || 'tomate'

  return normalizarRecetasIA({
    recetas: [
      {
        titulo: `Tortilla rapida de ${ingredientePrincipal}`,
        descripcion: `Bate huevos, mezcla con ${ingredientePrincipal} troceado y cocina a fuego medio por ambos lados.`,
        dificultad: 'Facil',
        ingredientes: [
          crearIngrediente('huevo', '4', 'unidad'),
          crearIngrediente(ingredientePrincipal, '1', 'unidad'),
          crearIngrediente('aceite de oliva', '2', 'cucharada'),
          crearIngrediente('sal', '1', 'pizca')
        ]
      },
      {
        titulo: `Pasta salteada con ${ingredienteSecundario}`,
        descripcion: `Cuece la pasta y salteala con ${ingredienteSecundario}, ajo y aceite de oliva.`,
        dificultad: 'Facil',
        ingredientes: [
          crearIngrediente('pasta', '250', 'g'),
          crearIngrediente(ingredienteSecundario, '2', 'unidad'),
          crearIngrediente('ajo', '2', 'diente'),
          crearIngrediente('aceite de oliva', '2', 'cucharada')
        ]
      },
      {
        titulo: 'Arroz salteado de la casa',
        descripcion: `Saltea arroz cocido con verduras y añade ${ingredientePrincipal} para dar sabor.`,
        dificultad: 'Media',
        ingredientes: [
          crearIngrediente('arroz cocido', '300', 'g'),
          crearIngrediente(ingredientePrincipal, '1', 'unidad'),
          crearIngrediente('zanahoria', '1', 'unidad'),
          crearIngrediente('cebolla', '1', 'unidad')
        ]
      },
      {
        titulo: 'Crema de verduras express',
        descripcion: 'Cuece verduras en caldo, tritura y ajusta sal y pimienta al final.',
        dificultad: 'Facil',
        ingredientes: [
          crearIngrediente('calabacin', '1', 'unidad'),
          crearIngrediente('patata', '1', 'unidad'),
          crearIngrediente('cebolla', '1', 'unidad'),
          crearIngrediente('caldo de verduras', '500', 'ml')
        ]
      },
      {
        titulo: 'Pollo al horno con especias',
        descripcion: `Hornea el pollo con especias y sirve con guarnicion de ${ingredienteSecundario}.`,
        dificultad: 'Media',
        ingredientes: [
          crearIngrediente('pollo', '500', 'g'),
          crearIngrediente('pimenton', '1', 'cucharadita'),
          crearIngrediente('ajo en polvo', '1', 'cucharadita'),
          crearIngrediente(ingredienteSecundario, '1', 'unidad')
        ]
      }
    ]
  })
}

function extraerNombreIngrediente (ingrediente) {
  if (typeof ingrediente === 'string') return ingrediente.trim()
  if (!ingrediente || typeof ingrediente !== 'object') return ''

  if (typeof ingrediente.nombre_ingrediente === 'string') {
    return ingrediente.nombre_ingrediente.trim()
  }

  if (ingrediente.nombre_ingrediente && typeof ingrediente.nombre_ingrediente === 'object') {
    if (typeof ingrediente.nombre_ingrediente.nombre_ingrediente === 'string') {
      return ingrediente.nombre_ingrediente.nombre_ingrediente.trim()
    }
    if (typeof ingrediente.nombre_ingrediente.nombre === 'string') {
      return ingrediente.nombre_ingrediente.nombre.trim()
    }
  }

  if (typeof ingrediente.nombre === 'string') {
    return ingrediente.nombre.trim()
  }

  return ''
}

function normalizarIngrediente (ingrediente) {
  const nombre = extraerNombreIngrediente(ingrediente)
  if (!nombre) return null

  const cantidadRaw = ingrediente && typeof ingrediente === 'object'
    ? ingrediente.cantidad
    : null
  const unidadRaw = ingrediente && typeof ingrediente === 'object'
    ? ingrediente.unidad
    : null

  return {
    nombre_ingrediente: nombre,
    cantidad: cantidadRaw != null ? String(cantidadRaw) : null,
    unidad: typeof unidadRaw === 'string' ? unidadRaw.trim() : ''
  }
}

function normalizarRecetasIA (payload) {
  const recetasCrudas = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.recetas)
      ? payload.recetas
      : []

  const recetas = recetasCrudas
    .filter((receta) => receta && typeof receta === 'object')
    .map((receta) => {
      const ingredientesCrudos = Array.isArray(receta.ingredientes) ? receta.ingredientes : []
      const ingredientes = ingredientesCrudos.map(normalizarIngrediente).filter(Boolean)

      const titulo = typeof receta.titulo === 'string' ? receta.titulo.trim() : ''
      const descripcion = typeof receta.descripcion === 'string' ? receta.descripcion.trim() : ''
      const dificultad = typeof receta.dificultad === 'string' ? receta.dificultad.trim() : 'Media'

      return {
        titulo,
        descripcion,
        ingredientes,
        cantidad_ingredientes: ingredientes.length,
        dificultad
      }
    })
    .filter((receta) => receta.titulo)
    .slice(0, 5)

  return { recetas }
}

class IAService {
  async recuperarRecetasIa (ingredientes) {
    if (!IA_TOKEN) {
      throw new Error('Falta IA_API_TOKEN en variables de entorno')
    }

    const ai = new GoogleGenAI({ apiKey: IA_TOKEN })
    const modelosCandidatos = construirModelosCandidatos()

    if (modelosCandidatos.length === 0) {
      throw new Error('No hay modelos de IA configurados')
    }

    const ingredientesSeguros = Array.isArray(ingredientes)
      ? ingredientes.map((ing) => String(ing).trim()).filter(Boolean)
      : []

    const instrucciones = `
    Actúa como un experto chef y nutricionista.
    El usuario te va a pasar una lista de ingredientes. Tu objetivo es devolver 5 recetas que usen algunos o todos esos ingredientes.
    Si el usuario escribe cosas que no son ingredientes (ej: "hola", "coches", "mierda"), debes detectarlo y mandar 5 recetas mas populares actuales.
    La dificultad de las recetas pueden ser "Fácil", "Media" o "Difícil" dependiendo de la complejidad de los pasos y la cantidad de ingredientes.
    REGLA DE ORO: TU RESPUESTA DEBE SER ÚNICA Y EXCLUSIVAMENTE UN CÓDIGO JSON VÁLIDO.
    NO ESCRIBAS NADA MÁS ANTES NI DESPUÉS.

    El formato JSON debe ser exactamente este:
      {
        "recetas": [
          {
            "titulo": "Nombre de la receta",
            "descripcion": "Breve descripción de los pasos a seguir",
            "ingredientes": [
              {
                "nombre_ingrediente": "Arroz",
                "cantidad": "1.00",
                "unidad": "kg"
              },
              {
                "nombre_ingrediente": "Pollo",
                "cantidad": "2.00",
                "unidad": "pechugas"
              }
            ],
            "cantidad_ingredientes": 2,
            "dificultad": "Fácil"
          }
        ]
      }

    Ingredientes del usuario: ${ingredientesSeguros.join(', ')}
    `

    let response = null
    let ultimoError = null

    // Recorremos modelos por orden: si uno falla por disponibilidad, probamos el siguiente.
    for (const modelo of modelosCandidatos) {
      try {
        response = await generarConModeloConReintentos(ai, modelo, instrucciones)
        break
      } catch (error) {
        ultimoError = error

        if (esErrorAutenticacionIA(error)) {
          throw crearErrorServicioIA('IA_API_TOKEN no es valido o no tiene permisos para usar Gemini', 502, error)
        }

        if (esErrorModeloNoDisponible(error)) {
          continue
        }

        if (esErrorTemporalIA(error)) {
          continue
        }

        if (!esErrorTemporalIA(error)) {
          throw error
        }
      }
    }

    if (!response) {
      // Si todo falla por causas temporales/no disponibilidad, devolvemos fallback local.
      if (esErrorTemporalIA(ultimoError) || esErrorModeloNoDisponible(ultimoError)) {
        logMensaje('Gemini no disponible temporalmente. Se devuelve fallback local.', ultimoError?.message || ultimoError)
        return construirRecetasFallback(ingredientesSeguros)
      }

      throw ultimoError
    }

    const textoRespuesta = extraerTextoRespuesta(response)
    const respuestaParseada = extraerPayloadJson(textoRespuesta)

    // Si la IA responde texto invalido o vacio, mantenemos contrato devolviendo recetas fallback.
    if (!respuestaParseada) {
      logMensaje('Gemini devolvio contenido no parseable. Se devuelve fallback local.', textoRespuesta)
      return construirRecetasFallback(ingredientesSeguros)
    }

    const recetasNormalizadas = normalizarRecetasIA(respuestaParseada)

    if (!Array.isArray(recetasNormalizadas?.recetas) || recetasNormalizadas.recetas.length === 0) {
      logMensaje('Gemini devolvio recetas vacias. Se devuelve fallback local.')
      return construirRecetasFallback(ingredientesSeguros)
    }

    return recetasNormalizadas
  }
}

module.exports = new IAService()
