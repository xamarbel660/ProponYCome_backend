// Recuperar función de inicialización de modelos
const initModels = require('../models/init-models.js').initModels
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require('../config/sequelize.js')
// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize)
// Recuperar el modelo director
const Receta = models.receta
const RecetaIngrediente = models.recetaIngrediente
const Ingrediente = models.ingrediente

class RecetaService {
  async recuperarRecetas (usuarioRecuperado) {
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

  async recuperarRecetasPaginadas (usuarioRecuperado, page, limit) {
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

  async recuperarRecetaPorId (idReceta, usuarioRecuperado) {
    const recetaBd = await Receta.findOne({
      where: { id_receta: idReceta, id_usuario_creador: usuarioRecuperado.id_usuario },
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

  async crearReceta (receta, usuarioRecuperado) {
    // Iniciamos la transacción
    const t = await sequelize.transaction()

    try {
      // Creamos la receta (le pasamos la transacción)
      // En receta solo viene el titulo, descripcion y dificultad
      receta.receta.id_usuario_creador = usuarioRecuperado.id_usuario
      const recetaCreada = await Receta.create(receta.receta, { transaction: t })

      // Usamos for...of para que espere a la base de datos
      for (const ing of receta.ingredientes) {
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

  async actualizarReceta (receta, usuarioRecuperado) {
    const t = await sequelize.transaction()

    try {
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

      for (const ing of receta.ingredientes) {
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

  async eliminarReceta (idReceta, usuarioRecuperado) {
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
