// Recuperar función de inicialización de modelos
const initModels = require('../models/init-models.js').initModels
const { Op } = require('sequelize')
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require('../config/sequelize.js')
// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize)
// Recuperar el modelo director
const Receta = models.receta
const RecetaIngrediente = models.recetaIngrediente
const Ingrediente = models.ingrediente
const Planning = models.planning
const UsuarioFamilia = models.usuarioFamilia

function normalizarIngredientesEntrada(ingredientes = []) {
  return ingredientes
    .map((ing) => {
      if (typeof ing === 'string') {
        const nombre = ing.trim()
        if (!nombre) return null

        return {
          nombre_ingrediente: nombre,
          cantidad: 1,
          unidad: 'unidad'
        }
      }

      if (!ing || typeof ing !== 'object') return null

      const nombre = String(ing.nombre_ingrediente || '').trim()
      if (!nombre) return null

      return {
        nombre_ingrediente: nombre,
        cantidad: ing.cantidad ?? 1,
        unidad: ing.unidad || 'unidad'
      }
    })
    .filter(Boolean)
}

class RecetaService {
  async recuperarRecetas(usuarioRecuperado) {
    const recetas = await Receta.findAll({
      attributes: [
        'id_receta',
        'titulo',
        'descripcion',
        'dificultad',
        [
          sequelize.fn('COUNT', sequelize.col('id_ingrediente_INGREDIENTEs.nombre_ingrediente')),
          'cantidadIngredientes'
        ]
      ],
      where: { id_usuario_creador: usuarioRecuperado.id_usuario },
      include: [
        {
          model: Ingrediente,
          as: 'id_ingrediente_INGREDIENTEs',
          // Dejamos los atributos vacíos aquí porque no queremos que nos devuelva
          // una lista/array con los datos del ingrediente, solo queremos contarlos arriba.
          attributes: [],
          through: {
            attributes: [] // Tampoco queremos datos de la tabla intermedia (RECETA_INGREDIENTE)
          }
        }
      ],
      group: ['receta.id_receta'],
      raw: true
    })
    return { recetas }
  }

  async recuperarRecetasPaginadas(usuarioRecuperado, page, limit) {
    const offset = (page - 1) * limit

    // Primero contamos el total de recetas del usuario
    const totalRecetas = await Receta.count({
      where: { id_usuario_creador: usuarioRecuperado.id_usuario }
    })

    // Luego recuperamos solo las recetas de esta página
    const recetas = await Receta.findAll({
      attributes: [
        'id_receta',
        'titulo',
        'descripcion',
        'dificultad',
        [
          sequelize.fn('COUNT', sequelize.col('id_ingrediente_INGREDIENTEs.nombre_ingrediente')),
          'cantidadIngredientes'
        ]
      ],
      where: { id_usuario_creador: usuarioRecuperado.id_usuario },
      include: [
        {
          model: Ingrediente,
          as: 'id_ingrediente_INGREDIENTEs',
          attributes: [],
          through: {
            attributes: []
          }
        }
      ],
      group: ['receta.id_receta'],
      subQuery: false,
      limit,
      offset,
      order: [['id_receta', 'ASC']], // Dejamos el orden clásico (las más antiguas primero, que es como estaba antes)
      raw: true
    })

    return { recetas, total: totalRecetas }
  }

  async recuperarRecetaPorId(idReceta, usuarioRecuperado) {
    const recetaBd = await Receta.findOne({
      where: { id_receta: idReceta },
      include: [
        {
          model: Ingrediente,
          as: 'id_ingrediente_INGREDIENTEs',
          through: {
            attributes: ['cantidad', 'unidad']
          }
        }
      ]
    })

    if (!recetaBd) return null

    let tienePermiso = false

    // ¿El usuario es el creador de la receta?
    if (recetaBd.id_usuario_creador === usuarioRecuperado.id_usuario) {
      tienePermiso = true
    } else {
      // No es el creador, verificamos si está en su planning familiar
      // Sacamos un array con los IDs de las familias a las que pertenece este usuario
      const familiasDelUsuario = await UsuarioFamilia.findAll({
        where: { id_usuario: usuarioRecuperado.id_usuario },
        attributes: ['id_familia'],
        raw: true
      })

      const idsFamilias = familiasDelUsuario.map(f => f.id_familia)

      // Buscamos si existe la receta en el planning de ALGUNA de esas familias
      if (idsFamilias.length > 0) {
        const permisoCompartido = await Planning.findOne({
          where: {
            id_receta: idReceta,
            id_familia: { [Op.in]: idsFamilias } // ¿Está el id_familia en su lista de familias?
          }
        })

        if (permisoCompartido) {
          tienePermiso = true
        }
      }
    }

    // Si después de comprobar todo NO tiene permiso, bloqueamos el acceso
    if (!tienePermiso) {
      throw new Error('No tienes permisos para ver esta receta.')
    }

    // Mapeamos los datos al formato solicitado
    const recetaFormateada = {
      id_receta: recetaBd.id_receta,
      titulo: recetaBd.titulo,
      descripcion: recetaBd.descripcion,
      dificultad: recetaBd.dificultad
    }

    const ingredientesFormateados = recetaBd.id_ingrediente_INGREDIENTEs.map((ing) => ({
      nombre_ingrediente: ing.nombre_ingrediente,
      cantidad: ing.recetaIngrediente.cantidad,
      unidad: ing.recetaIngrediente.unidad
    }))

    const payload = {
      receta: recetaFormateada,
      ingredientes: ingredientesFormateados
    }

    return payload
  }

  async buscarRecetaPorTitulo(titulo, usuarioRecuperado) {
    const recetas = await Receta.findAll({
      where: { id_usuario_creador: usuarioRecuperado.id_usuario, titulo: { [Op.like]: `%${titulo}%` } },
      group: ['receta.id_receta'],
      raw: true
    })
    return { recetas }
  }

  async crearReceta(receta, usuarioRecuperado) {
    // Iniciamos la transacción
    const t = await sequelize.transaction()

    try {
      const recetaExistente = await this.buscarRecetaPorTitulo(receta.receta.titulo, usuarioRecuperado)
      if (recetaExistente.recetas.length > 0) {
        throw new Error('Ya existe una receta con ese título')
      }

      const ingredientesNormalizados = normalizarIngredientesEntrada(receta.ingredientes)
      if (ingredientesNormalizados.length === 0) {
        throw new Error('La receta debe incluir al menos un ingrediente válido')
      }

      // Creamos la receta (le pasamos la transacción)
      // En receta solo viene el titulo, descripcion y dificultad
      receta.receta.id_usuario_creador = usuarioRecuperado.id_usuario
      const recetaCreada = await Receta.create(receta.receta, { transaction: t })

      // Usamos for...of para que espere a la base de datos
      for (const ing of ingredientesNormalizados) {
        // findOrCreate busca el ingrediente. Si no existe, lo crea automáticamente.
        // 'ingredienteBd' es el objeto de la base de datos, 'created' es un booleano (true si lo acaba de crear)
        const [ingredienteBd] = await Ingrediente.findOrCreate({
          where: { nombre_ingrediente: ing.nombre_ingrediente },
          transaction: t
        })

        // Creamos la relación
        await RecetaIngrediente.create(
          {
            id_receta: recetaCreada.id_receta,
            id_ingrediente: ingredienteBd.id_ingrediente,
            cantidad: ing.cantidad,
            unidad: ing.unidad
          },
          { transaction: t }
        )
      }

      // Si todo ha ido bien, guardamos los cambios en la base de datos definitivamente
      await t.commit()

      return { recetaCreada }
    } catch (error) {
      // Si falla cualquier cosa (ej. falta la cantidad), deshacemos TODO para no dejar datos a medias
      await t.rollback()
      console.error('Error al crear la receta y sus ingredientes:', error)
      // Lanzamos el error para que el controlador lo capture y devuelva un status 500 al frontend
      throw error
    }
  }

  async actualizarReceta(receta, usuarioRecuperado) {
    const t = await sequelize.transaction()

    try {
      const ingredientesNormalizados = normalizarIngredientesEntrada(receta.ingredientes)
      if (ingredientesNormalizados.length === 0) {
        throw new Error('La receta debe incluir al menos un ingrediente válido')
      }

      receta.receta.id_usuario_creador = usuarioRecuperado.id_usuario

      await Receta.update(receta.receta, {
        where: {
          id_receta: receta.receta.id_receta,
          id_usuario_creador: usuarioRecuperado.id_usuario
        },
        transaction: t
      })

      await RecetaIngrediente.destroy({
        where: { id_receta: receta.receta.id_receta },
        transaction: t
      })

      for (const ing of ingredientesNormalizados) {
        // Buscamos/Creamos el ingrediente global
        const [ingredienteBd] = await Ingrediente.findOrCreate({
          where: { nombre_ingrediente: ing.nombre_ingrediente },
          transaction: t
        })

        // Creamos la relación nueva (¡Ahora el create sí tiene todo el sentido del mundo!)
        await RecetaIngrediente.create(
          {
            id_receta: receta.receta.id_receta, // Usamos el ID de la receta que nos llega
            id_ingrediente: ingredienteBd.id_ingrediente,
            cantidad: ing.cantidad,
            unidad: ing.unidad
          },
          { transaction: t }
        )
      }

      await t.commit()

      // Devolvemos un mensaje de éxito
      return { mensaje: 'Receta actualizada correctamente' }
    } catch (error) {
      await t.rollback()
      console.error('Error al actualizar la receta y sus ingredientes:', error)
      throw error
    }
  }

  async eliminarReceta(idReceta, usuarioRecuperado) {
    const result = await Receta.destroy({
      where: {
        id_receta: idReceta,
        id_usuario_creador: usuarioRecuperado.id_usuario
      }
    })
    return result
  }
}

module.exports = new RecetaService()
