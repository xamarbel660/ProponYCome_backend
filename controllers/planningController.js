const { logMensaje } = require('../utils/logger.js')
const planningService = require('../services/planningService.js')
const { singlePlanningDTO } = require('../utils/modelosDTO.js')

class PlanningController {
  async recuperarPropuestasSemanal(req, res) {
    const usuarioRecuperado = req.usuario
    const datosPropuestas = req.body.datosPropuestas
    try {
      const propuestasSemanal = await planningService.recuperarPropuestasSemanal(usuarioRecuperado, datosPropuestas)
      return res.status(201).json({
        ok: true,
        datos: propuestasSemanal,
        mensaje: 'Propuestas semanal recuperadas correctamente'
      })
    } catch (err) {
      logMensaje('Error en recuperarPropuestasSemanal:', err)
      return res.status(401).json({
        ok: false,
        datos: null,
        mensaje: 'Error al recuperar las propuestas semanal: ' + err.message
      })
    }
  }

  async crearPropuesta(req, res) {
    const usuarioRecuperado = req.usuario
    const propuesta = req.body.propuesta
    try {
      const propuestaCreada = await planningService.crearPropuesta(usuarioRecuperado, propuesta)
      const propuestaDTO = singlePlanningDTO(propuestaCreada)
      return res.status(201).json({
        ok: true,
        datos: propuestaDTO,
        mensaje: 'Propuesta creada correctamente'
      })
    } catch (err) {
      logMensaje('Error en crearPropuesta:', err)
      return res.status(401).json({
        ok: false,
        datos: null,
        mensaje: 'Error al crear la propuesta: ' + err.message
      })
    }
  }

  async estadoPropuesta(req, res) {
    const usuarioRecuperado = req.usuario
    const respuestaAdmin = req.body.respuestaAdmin
    try {
      const RespuestaEstadoPropuesta = await planningService.estadoPropuesta(usuarioRecuperado, respuestaAdmin)
      return res.status(201).json({
        ok: true,
        datos: RespuestaEstadoPropuesta,
        mensaje: 'Estado de la propuesta recuperado correctamente'
      })
    } catch (err) {
      logMensaje('Error en estadoPropuesta:', err)
      return res.status(401).json({
        ok: false,
        datos: null,
        mensaje: 'Error al recuperar el estado de la propuesta: ' + err.message
      })
    }
  }
}

module.exports = new PlanningController()
