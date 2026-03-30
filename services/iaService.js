const { GoogleGenAI } = require('@google/genai')

const IA_TOKEN = process.env.IA_API_TOKEN
const IA_MODEL = process.env.IA_MODEL
const IA_MODELOS_FALLBACK = (process.env.IA_MODELOS_FALLBACK || '')
  .split(',')
  .map((m) => m.trim())
  .filter(Boolean)
const IA_MAX_PETICIONES = Number.parseInt(process.env.IA_MAX_PETICIONES, 10)

// Recuperar función de inicialización de modelos
const initModels = require('../models/init-models.js').initModels
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require('../config/sequelize.js')
// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize)
const IA = models.ia

function esErrorTemporalIA(error) {
  const status = Number(error?.status || error?.error?.code)
  const providerStatus = error?.error?.status

  return [429, 500, 502, 503, 504].includes(status) || providerStatus === 'UNAVAILABLE' || providerStatus === 'RESOURCE_EXHAUSTED'
}

function crearErrorServicioIA(mensaje, status, cause) {
  const error = new Error(mensaje)
  error.status = status
  error.cause = cause
  return error
}

async function generarConModelo(ai, model, instrucciones) {
  return ai.models.generateContent({
    model,
    contents: instrucciones,
    config: {
      responseMimeType: 'application/json'
    }
  })
}

function extraerNombreIngrediente(ingrediente) {
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

function normalizarIngrediente(ingrediente) {
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

function normalizarRecetasIA(payload) {
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

async function verificarLimiteIA() {
  // Sacamos la fecha de hoy en formato 'YYYY-MM-DD'
  const fechaHoy = new Date().toISOString().split('T')[0]

  try {
    // Comprobamos si ya hay un registro hoy
    const peticionesHoy = await IA.findOne({
      where: { fecha: fechaHoy },
      attributes: ['peticiones_realizadas'],
      raw: true
    })

    if (!peticionesHoy) {
      // No hay peticiones hoy, así que está dentro del límite.
      return true
    }

    const peticionesActuales = peticionesHoy.peticiones_realizadas
    if (peticionesActuales < IA_MAX_PETICIONES) {
      return true
    }

    // ¡Peligro! Ya ha hecho el máximo de peticiones. Cortamos el paso.
    return false
  } catch (error) {
    console.error('Error al comprobar los límites de la IA:', error)
    // Si falla la base de datos, por seguridad es mejor bloquear o dejar pasar según prefieras.
    // Lo normal es lanzar el error o devolver false.
    throw error
  }
}

async function registrarPeticionIA() {
  const fechaHoy = new Date().toISOString().split('T')[0]

  const peticionesHoy = await IA.findOne({
    where: { fecha: fechaHoy },
    attributes: ['peticiones_realizadas'],
    raw: true
  })

  if (!peticionesHoy) {
    await IA.create({ fecha: fechaHoy, peticiones_realizadas: 1 })
    return
  }

  await IA.update(
    { peticiones_realizadas: peticionesHoy.peticiones_realizadas + 1 },
    { where: { fecha: fechaHoy } }
  )
}

class IAService {
  async recuperarRecetasIa(ingredientes) {
    if (!IA_TOKEN) {
      throw new Error('Falta IA_API_TOKEN en variables de entorno')
    }

    if (!IA_MODEL) {
      throw new Error('Falta IA_MODEL en variables de entorno')
    }

    if (Number.isNaN(IA_MAX_PETICIONES) || IA_MAX_PETICIONES < 1) {
      throw new Error('IA_MAX_PETICIONES debe ser un entero mayor que 0')
    }

    const limiteDisponible = await verificarLimiteIA()
    if (!limiteDisponible) {
      throw crearErrorServicioIA('Se ha alcanzado el límite diario de peticiones de IA', 429)
    }

    const ai = new GoogleGenAI({ apiKey: IA_TOKEN })
    const modelosCandidatos = [IA_MODEL, ...IA_MODELOS_FALLBACK].filter((modelo, index, arr) => arr.indexOf(modelo) === index)

    const ingredientesSeguros = Array.isArray(ingredientes)
      ? ingredientes.map((ing) => String(ing).trim()).filter(Boolean)
      : []

    const instrucciones = `
    Actúa como un experto chef y nutricionista.
    El usuario te va a pasar una lista de ingredientes. Tu objetivo es devolver 5 recetas que usen algunos o todos esos ingredientes.
    Si el usuario escribe cosas que no son ingredientes (ej: "hola", "coches", insultos), debes detectarlo y mandar 5 recetas mas populares.
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
                "nombre_ingrediente": "arroz",
                "cantidad": "1.00",
                "unidad": "kg"
              },
              {
                "nombre_ingrediente": "pollo",
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

    for (const modelo of modelosCandidatos) {
      try {
        response = await generarConModelo(ai, modelo, instrucciones)
        break
      } catch (error) {
        ultimoError = error

        if (!esErrorTemporalIA(error)) {
          throw error
        }
      }
    }

    if (!response) {
      if (esErrorTemporalIA(ultimoError)) {
        return { recetas: [] }
      }

      throw ultimoError
    }

    const textoRespuesta = response.text || ''
    const jsonLimpio = textoRespuesta
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/, '')
      .trim()

    let respuestaParseada
    try {
      respuestaParseada = JSON.parse(jsonLimpio)
      if (typeof respuestaParseada === 'string') {
        respuestaParseada = JSON.parse(respuestaParseada)
      }
    } catch (error) {
      throw crearErrorServicioIA('La respuesta de IA no es un JSON válido', 502, error)
    }

    const recetasNormalizadas = normalizarRecetasIA(respuestaParseada)

    await registrarPeticionIA()

    return recetasNormalizadas
  }
}

module.exports = new IAService()
