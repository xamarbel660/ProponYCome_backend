// controllers/campañaController.js
const { logMensaje } = require('../utils/logger.js')
const recetaService = require('../services/recetaService.js')

class RecetaController {
  async recuperarRecetas (req, res) {
    const usuarioRecuperado = req.usuario
    try {
      const recetasRecuperadas = await recetaService.recuperarRecetas(usuarioRecuperado)

      return res.status(201).json({
        ok: true,
        datos: recetasRecuperadas,
        mensaje: 'Recetas recuperadas correctamente'
      })
    } catch (err) {
      logMensaje('Error en recuperarRecetas:', err)
      return res.status(401).json({
        ok: false,
        datos: null,
        mensaje: 'Error al recuperar las recetas: ' + err.message
      })
    }
  }

  async recuperarRecetaPorId (req, res) {
    const idReceta = req.params.id_receta
    const usuarioRecuperado = req.usuario
    try {
      const recetaRecuperada = await recetaService.recuperarRecetaPorId(idReceta, usuarioRecuperado)

      return res.status(201).json({
        ok: true,
        datos: recetaRecuperada,
        mensaje: 'Receta recuperada correctamente'
      })
    } catch (err) {
      logMensaje('Error en recuperarRecetaPorId:', err)
      return res.status(401).json({
        ok: false,
        datos: null,
        mensaje: 'Error al recuperar la receta: ' + err.message
      })
    }
  }

  async crearReceta (req, res) {
    const receta = req.body
    const usuarioRecuperado = req.usuario
    try {
      const recetaCreada = await recetaService.crearReceta(receta, usuarioRecuperado)

      return res.status(201).json({
        ok: true,
        datos: recetaCreada,
        mensaje: 'Receta creada correctamente'
      })
    } catch (err) {
      logMensaje('Error en crearReceta:', err)
      return res.status(401).json({
        ok: false,
        datos: null,
        mensaje: 'Error al crear la receta: ' + err.message
      })
    }
  }

  async actualizarReceta (req, res) {
    const receta = req.body
    const usuarioRecuperado = req.usuario
    try {
      const recetaActualizada = await recetaService.actualizarReceta(receta, usuarioRecuperado)

      return res.status(201).json({
        ok: true,
        datos: recetaActualizada,
        mensaje: 'Receta actualizada correctamente'
      })
    } catch (err) {
      logMensaje('Error en actualizarReceta:', err)
      return res.status(401).json({
        ok: false,
        datos: null,
        mensaje: 'Error al actualizar la receta: ' + err.message
      })
    }
  }

  async eliminarReceta (req, res) {
    const idReceta = req.params.id_receta
    const usuarioRecuperado = req.usuario
    try {
      await recetaService.eliminarReceta(idReceta, usuarioRecuperado)

      return res.status(201).json({
        ok: true,
        datos: null,
        mensaje: 'Receta eliminada correctamente'
      })
    } catch (err) {
      logMensaje('Error en eliminarReceta:', err)
      return res.status(401).json({
        ok: false,
        datos: null,
        mensaje: 'Error al eliminar la receta: ' + err.message
      })
    }
  }
}

module.exports = new RecetaController()
