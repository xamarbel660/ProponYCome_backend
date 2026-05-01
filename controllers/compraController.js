const { logMensaje } = require('../utils/logger.js')
const compraService = require('../services/compraService.js')

class CompraController {
  async recuperarIngredientesHaComprar (req, res) {
    const idFamilia = req.params.idFamilia
    const fechaLunes = req.params.fechaLunes
    try {
      const ingredientesRecuperados = await compraService.recuperarIngredientesHaComprar(idFamilia, fechaLunes)

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

  async actualizarEstadoItem (req, res) {
    const idItem = req.params.idItem
    const { comprado } = req.body
    try {
      const ingredienteActualizado = await compraService.actualizarEstadoItem(idItem, comprado)

      return res.status(200).json({
        ok: true,
        datos: ingredienteActualizado,
        mensaje: 'Ingrediente actualizado correctamente'
      })
    } catch (err) {
      logMensaje('Error en actualizarEstadoItem:', err)
      return res.status(401).json({
        ok: false,
        datos: null,
        mensaje: 'Error al actualizar el estado del ingrediente: ' + err.message
      })
    }
  }
}

module.exports = new CompraController()
