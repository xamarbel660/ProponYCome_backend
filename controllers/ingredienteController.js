// controllers/campañaController.js
const { logMensaje } = require('../utils/logger.js')
const ingredienteService = require('../services/ingredienteService.js')

class IngredienteController {
  async recuperarIngredientes (req, res) {
    try {
      const ingredientesRecuperados = await ingredienteService.recuperarIngredientes()

      return res.status(201).json({
        ok: true,
        datos: ingredientesRecuperados,
        mensaje: 'Ingredientes recuperados correctamente'
      })
    } catch (err) {
      logMensaje('Error en recuperarIngredientes:', err)
      return res.status(401).json({
        ok: false,
        datos: null,
        mensaje: 'Error al recuperar los ingredientes: ' + err.message
      })
    }
  }

  // async crearReceta (req, res) {
  //   const receta = req.body
  //   const usuarioRecuperado = req.usuario
  //   try {
  //     const recetaCreada = await recetaService.crearReceta(receta, usuarioRecuperado)

  //     return res.status(201).json({
  //       ok: true,
  //       datos: recetaCreada,
  //       mensaje: 'Receta creada correctamente'
  //     })
  //   } catch (err) {
  //     logMensaje('Error en crearReceta:', err)
  //     return res.status(401).json({
  //       ok: false,
  //       datos: null,
  //       mensaje: 'Error al crear la receta: ' + err.message
  //     })
  //   }
  // }

  // async actualizarReceta (req, res) {
  //   const receta = req.body
  //   try {
  //     const recetaActualizada = await recetaService.actualizarReceta(receta)

  //     return res.status(201).json({
  //       ok: true,
  //       datos: recetaActualizada,
  //       mensaje: 'Receta actualizada correctamente'
  //     })
  //   } catch (err) {
  //     logMensaje('Error en actualizarReceta:', err)
  //     return res.status(401).json({
  //       ok: false,
  //       datos: null,
  //       mensaje: 'Error al actualizar la receta: ' + err.message
  //     })
  //   }
  // }
}

module.exports = new IngredienteController()
