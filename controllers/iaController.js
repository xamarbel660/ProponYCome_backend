const { logMensaje } = require('../utils/logger.js')
const iaService = require('../services/iaService.js')

class IAController {
  async recuperarRecetasIa (req, res) {
    const ingredientes = req.body?.ingredientes

    if (typeof ingredientes === 'undefined') {
      return res.status(400).json({
        ok: false,
        datos: null,
        mensaje: 'El campo ingredientes es obligatorio'
      })
    }

    try {
      const recetasIA = await iaService.recuperarRecetasIa(ingredientes)

      return res.status(200).json({
        ok: true,
        datos: recetasIA,
        mensaje: 'Recetas de IA recuperadas correctamente'
      })
    } catch (err) {
      logMensaje('Error en recuperarRecetasIa:', err)

      const codigo = Number(err?.status)
      const status = [429, 502, 503].includes(codigo) ? codigo : 500

      return res.status(status).json({
        ok: false,
        datos: null,
        mensaje: 'Error al recuperar las recetas de IA: ' + err.message
      })
    }
  }
}

module.exports = new IAController()
