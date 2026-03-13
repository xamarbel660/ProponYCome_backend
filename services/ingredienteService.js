// services/usuarioService.js
// Servicio para interactuar con el modelo Sequelize `usuario`

// Recuperar función de inicialización de modelos
const initModels = require('../models/init-models.js').initModels
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require('../config/sequelize.js')
// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize)
// Recuperar el modelo director
const Ingrediente = models.ingrediente

class RecetaService {
  async recuperarIngredientes () {
    const ingredientes = await Ingrediente.findAll({
      attributes: [
        'id_ingrediente',
        'nombre_ingrediente'
      ],
      raw: true
    })
    return { ingredientes }
  }

  // async recuperarRecetaPorId (usuarioRecuperado) {
  //   const recetas = await Receta.findAll({
  //     attributes: [
  //       'titulo',
  //       'descripcion',
  //       'dificultad',
  //       [
  //         sequelize.fn('COUNT', sequelize.col('id_ingrediente_INGREDIENTEs.nombre_ingrediente')),
  //         'cantidadIngredientes'
  //       ]
  //     ],
  //     where: { id_usuario_creador: usuarioRecuperado.id_usuario },
  //     include: [
  //       {
  //         model: Ingrediente,
  //         as: 'id_ingrediente_INGREDIENTEs',
  //         // Dejamos los atributos vacíos aquí porque no queremos que nos devuelva
  //         // una lista/array con los datos del ingrediente, solo queremos contarlos arriba.
  //         attributes: [],
  //         through: {
  //           attributes: [] // Tampoco queremos datos de la tabla intermedia (RECETA_INGREDIENTE)
  //         }
  //       }
  //     ],
  //     group: ['receta.id_receta'],
  //     raw: true
  //   })
  //   return { recetas }
  // }

  // async crearReceta (receta, usuarioRecuperado) {
  //   // Iniciamos la transacción
  //   const t = await sequelize.transaction()

  //   try {
  //     // Creamos la receta (le pasamos la transacción)
  //     // En receta solo viene el titulo, descripcion y dificultad
  //     receta.receta.id_usuario_creador = usuarioRecuperado.id_usuario
  //     const recetaCreada = await Receta.create(receta.receta, { transaction: t })

  //     // Usamos for...of para que espere a la base de datos
  //     for (const ing of receta.ingredientes) {
  //       // findOrCreate busca el ingrediente. Si no existe, lo crea automáticamente.
  //       // 'ingredienteBd' es el objeto de la base de datos, 'created' es un booleano (true si lo acaba de crear)
  //       const [ingredienteBd] = await Ingrediente.findOrCreate({
  //         where: { nombre_ingrediente: ing.nombre_ingrediente },
  //         // defaults es lo que usará si tiene que crearlo nuevo
  //         defaults: { unidad_medida: ing.unidad_medida || 'unidades' },
  //         transaction: t
  //       })

  //       // Creamos la relación
  //       await RecetaIngrediente.create(
  //         {
  //           id_receta: recetaCreada.id_receta,
  //           id_ingrediente: ingredienteBd.id_ingrediente,
  //           cantidad: ing.cantidad
  //         },
  //         { transaction: t }
  //       )
  //     }

  //     // Si todo ha ido bien, guardamos los cambios en la base de datos definitivamente
  //     await t.commit()

  //     return { recetaCreada }
  //   } catch (error) {
  //     // Si falla cualquier cosa (ej. falta la cantidad), deshacemos TODO para no dejar datos a medias
  //     await t.rollback()
  //     console.error('Error al crear la receta y sus ingredientes:', error)
  //     // Lanzamos el error para que el controlador lo capture y devuelva un status 500 al frontend
  //     throw error
  //   }
  // }

  // async actualizarReceta (receta) {
  //   // Iniciamos la transacción
  //   const t = await sequelize.transaction()

  //   try {
  //     // Actualizamos la receta (le pasamos la transacción)
  //     const recetaActualizada = await Receta.update(receta.receta, {
  //       where: { id_receta: receta.receta.id_receta },
  //       transaction: t
  //     })

  //     // Usamos for...of para que espere a la base de datos
  //     for (const ing of receta.ingredientes) {
  //       // findOrCreate busca el ingrediente. Si no existe, lo crea automáticamente.
  //       // 'ingredienteBd' es el objeto de la base de datos, 'created' es un booleano (true si lo acaba de crear)
  //       const [ingredienteBd] = await Ingrediente.findOrCreate({
  //         where: { nombre_ingrediente: ing.nombre_ingrediente },
  //         // defaults es lo que usará si tiene que crearlo nuevo
  //         defaults: { unidad_medida: ing.unidad_medida || 'unidades' },
  //         transaction: t
  //       })

  //       // Creamos la relación
  //       await RecetaIngrediente.create(
  //         {
  //           id_receta: recetaActualizada.id_receta,
  //           id_ingrediente: ingredienteBd.id_ingrediente,
  //           cantidad: ing.cantidad
  //         },
  //         { transaction: t }
  //       )
  //     }

  //     // Si todo ha ido bien, guardamos los cambios en la base de datos definitivamente
  //     await t.commit()

  //     return { recetaActualizada }
  //   } catch (error) {
  //     // Si falla cualquier cosa (ej. falta la cantidad), deshacemos TODO para no dejar datos a medias
  //     await t.rollback()
  //     console.error('Error al actualizar la receta y sus ingredientes:', error)
  //     // Lanzamos el error para que el controlador lo capture y devuelva un status 500 al frontend
  //     throw error
  //   }
  // }
}

module.exports = new RecetaService()
