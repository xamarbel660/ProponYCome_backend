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
}

module.exports = new IngredienteController()
