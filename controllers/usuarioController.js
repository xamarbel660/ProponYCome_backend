const { logMensaje } = require('../utils/logger.js')
const usuarioService = require('../services/usuarioService.js')
const { singleUserDTO } = require('../utils/usuarioDTO.js')

class UsuarioController {
  async loginUsuario (req, res) {
    const usuarioBody = req.body
    try {
      const { usuario, token } = await usuarioService.loginUsuario(usuarioBody)

      // Sanitizamos el objeto creado para solo mandar nombre y email
      const usuarioSanitizado = singleUserDTO(usuario)
      return res.status(201).json({
        ok: true,
        datos: usuarioSanitizado,
        token,
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
      const { usuarioNew, token } = await usuarioService.registerUsuario(usuario)
      // Sanitizamos el objeto creado para solo mandar nombre y email
      const usuarioSanitizado = singleUserDTO(usuarioNew)

      return res.status(201).json({
        ok: true,
        datos: usuarioSanitizado,
        token,
        mensaje: 'Usuario registrado correctamente'
      })
    } catch (err) {
      logMensaje('Error en registerUsuario:', err)
      return res.status(400).json({
        ok: false,
        datos: null,
        mensaje: err.message
      })
    }
  }
}

module.exports = new UsuarioController()
