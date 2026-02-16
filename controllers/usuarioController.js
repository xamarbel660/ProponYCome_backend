// controllers/campañaController.js
const { logMensaje } = require('../utils/logger.js')
const usuarioService = require('../services/usuarioService.js')
const { singleUserDTO } = require('../utils/usuarioDTO.js')

class UsuarioController {
  async loginUsuario (req, res) {
    const usuarioBody = req.body
    try {
      const usuario = await usuarioService.loginUsuario(usuarioBody)

      // Sanitizamos el objeto creado
      const usuarioSanitizado = singleUserDTO(usuario)
      return res.status(201).json({
        ok: true,
        datos: usuarioSanitizado,
        mensaje: 'Usuario logueado correctamente'
      })
    } catch (err) {
      logMensaje('Error en loginUsuario:', err)
      return res.status(401).json({
        ok: false,
        datos: null,
        mensaje: 'Error al loguearse: ' + err.message
      })
    }
  }

  async registerUsuario (req, res) {
    const usuario = req.body

    try {
      const usuarioNew = await usuarioService.registerUsuario(usuario)
      // Sanitizamos el objeto creado
      const usuarioSanitizado = singleUserDTO(usuarioNew)

      return res.status(201).json({
        ok: true,
        datos: usuarioSanitizado,
        mensaje: 'Usuario registrado correctamente'
      })
    } catch (err) {
      logMensaje('Error en registerUsuario:', err)
      return res.status(400).json({
        ok: false,
        datos: null,
        mensaje: 'Error al registrar al usuario: ' + err.message
      })
    }
  }
}

module.exports = new UsuarioController()
