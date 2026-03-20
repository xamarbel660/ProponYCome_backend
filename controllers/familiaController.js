const { logMensaje } = require('../utils/logger.js')
const familiaService = require('../services/familiaService.js')
const { singleFamiliaDTO } = require('../utils/modelosDTO.js')

class FamiliaController {
  async recuperarFamilias(req, res) {
    const usuarioRecuperado = req.usuario
    try {
      const familiasRecuperadas = await familiaService.recuperarFamilias(usuarioRecuperado)
      return res.status(201).json({
        ok: true,
        datos: familiasRecuperadas,
        mensaje: 'Familias recuperadas correctamente'
      })
    } catch (err) {
      logMensaje('Error en recuperarFamilias:', err)
      return res.status(401).json({
        ok: false,
        datos: null,
        mensaje: 'Error al recuperar las familias: ' + err.message
      })
    }
  }

  async recuperarFamiliasPaginadas(req, res) {
    const usuarioRecuperado = req.usuario
    const page = parseInt(req.body.page) || 1
    const limit = 5

    try {
      const resultado = await familiaService.recuperarFamiliasPaginadas(
        usuarioRecuperado,
        page,
        limit
      )

      return res.status(201).json({
        ok: true,
        datos: resultado,
        mensaje: 'Familias recuperadas correctamente'
      })
    } catch (err) {
      logMensaje('Error en recuperarFamiliasPaginadas:', err)
      return res.status(401).json({
        ok: false,
        datos: null,
        mensaje: 'Error al recuperar las familias paginadas: ' + err.message
      })
    }
  }

  async recuperarFamiliaPorId(req, res) {
    const idFamilia = req.params.id_familia
    const usuarioRecuperado = req.usuario
    try {
      const familiaRecuperada = await familiaService.recuperarFamiliaPorId(
        idFamilia,
        usuarioRecuperado
      )

      return res.status(201).json({
        ok: true,
        datos: familiaRecuperada,
        mensaje: 'Familia recuperada correctamente'
      })
    } catch (err) {
      logMensaje('Error en recuperarFamiliaPorId:', err)
      return res.status(401).json({
        ok: false,
        datos: null,
        mensaje: 'Error al recuperar la familia: ' + err.message
      })
    }
  }

  async crearFamilia(req, res) {
    const familia = req.body.familia
    const usuarioRecuperado = req.usuario
    try {
      const familiaCreada = await familiaService.crearFamilia(familia, usuarioRecuperado)
      // Sanitizamos el objeto creado para solo mandar nombre y el codigo de invitacion
      const familiaSanitizada = singleFamiliaDTO(familiaCreada)
      return res.status(201).json({
        ok: true,
        datos: familiaSanitizada,
        mensaje: 'Familia creada correctamente'
      })
    } catch (err) {
      logMensaje('Error en crearFamilia:', err)
      return res.status(401).json({
        ok: false,
        datos: null,
        mensaje: 'Error al crear la familia: ' + err.message
      })
    }
  }

  async actualizarCodigoInvitacion(req, res) {
    const idFamilia = req.params.id_familia
    const usuarioRecuperado = req.usuario
    try {
      const codigoCambiado = await familiaService.actualizarCodigoInvitacion(idFamilia, usuarioRecuperado)

      return res.status(201).json({
        ok: true,
        datos: codigoCambiado,
        mensaje: 'Código de invitación actualizado correctamente.'
      })
    } catch (err) {
      logMensaje('Error en actualizarCodigoInvitacion:', err)
      return res.status(401).json({
        ok: false,
        datos: null,
        mensaje: 'Error al actualizar el código de invitación: ' + err.message
      })
    }
  }

  async entrarFamilia(req, res) {
    const codigoInvitacion = req.params.codigo_invitacion
    const usuarioRecuperado = req.usuario
    try {
      await familiaService.entrarFamilia(codigoInvitacion, usuarioRecuperado)

      return res.status(201).json({
        ok: true,
        datos: null,
        mensaje: 'Has entrado en la familia correctamente.'
      })
    } catch (err) {
      logMensaje('Error en entrarFamilia:', err)
      return res.status(401).json({
        ok: false,
        datos: null,
        mensaje: 'Error al entrar en la familia: ' + err.message
      })
    }
  }

  async actualizarFamilia(req, res) {
    const familia = req.body
    const usuarioRecuperado = req.usuario
    try {
      const familiaActualizada = await familiaService.actualizarFamilia(familia, usuarioRecuperado)

      return res.status(201).json({
        ok: true,
        datos: familiaActualizada,
        mensaje: 'Familia actualizada correctamente'
      })
    } catch (err) {
      logMensaje('Error en actualizarFamilia:', err)
      return res.status(401).json({
        ok: false,
        datos: null,
        mensaje: 'Error al actualizar la familia: ' + err.message
      })
    }
  }

  async salirFamilia(req, res) {
    const idFamilia = req.params.id_familia
    const usuarioRecuperado = req.usuario
    try {
      await familiaService.salirFamilia(idFamilia, usuarioRecuperado)

      return res.status(201).json({
        ok: true,
        datos: null,
        mensaje: 'Has salido de la familia correctamente.'
      })
    } catch (err) {
      logMensaje('Error en salirFamilia:', err)
      return res.status(401).json({
        ok: false,
        datos: null,
        mensaje: 'Error al salir de la familia: ' + err.message
      })
    }
  }

  async cambiarRolAdmin(req, res) {
    const idFamilia = req.params.id_familia
    const idUsuarioObjetivo = req.params.id_usuario_objetivo
    const esAdministrador = req.body.es_administrador
    const usuarioRecuperado = req.usuario

    try {
      const miembroActualizado = await familiaService.cambiarRolAdmin(
        idFamilia,
        idUsuarioObjetivo,
        esAdministrador,
        usuarioRecuperado
      )

      return res.status(201).json({
        ok: true,
        datos: miembroActualizado,
        mensaje: 'Rol de administrador actualizado correctamente.'
      })
    } catch (err) {
      logMensaje('Error en cambiarRolAdmin:', err)
      return res.status(401).json({
        ok: false,
        datos: null,
        mensaje: 'Error al cambiar el rol del miembro: ' + err.message
      })
    }
  }

  async expulsarMiembro(req, res) {
    const idFamilia = req.params.id_familia
    const idUsuarioObjetivo = req.params.id_usuario_objetivo
    const usuarioRecuperado = req.usuario

    try {
      await familiaService.expulsarMiembro(idFamilia, idUsuarioObjetivo, usuarioRecuperado)

      return res.status(201).json({
        ok: true,
        datos: null,
        mensaje: 'Miembro expulsado correctamente.'
      })
    } catch (err) {
      logMensaje('Error en expulsarMiembro:', err)
      return res.status(401).json({
        ok: false,
        datos: null,
        mensaje: 'Error al expulsar al miembro: ' + err.message
      })
    }
  }

  async eliminarFamilia(req, res) {
    const idFamilia = req.params.id_familia
    const usuarioRecuperado = req.usuario
    try {
      await familiaService.eliminarFamilia(idFamilia, usuarioRecuperado)

      return res.status(201).json({
        ok: true,
        datos: null,
        mensaje: 'Familia eliminada correctamente'
      })
    } catch (err) {
      logMensaje('Error en eliminarFamilia:', err)
      return res.status(401).json({
        ok: false,
        datos: null,
        mensaje: 'Error al eliminar la familia: ' + err.message
      })
    }
  }
}

module.exports = new FamiliaController()
