const jwt = require('jsonwebtoken')
const config = require('../config/config')

const generarToken = (usuario) => {
  // Payload: Datos que se guardan dentro del token
  const payload = {
    id_usuario: usuario.id_usuario,
    nombre: usuario.nombre,
    email: usuario.email
  }

  // Firmamos el token
  // No envolvemos el token en una cookie (cookie-parser) ya que para moviles puede fallar
  return jwt.sign(payload, config.secretKey, {
    expiresIn: '7d' // Por ahora que expire en 7 días
  })
}

const verificarToken = (token) => {
  try {
    // Si la firma es inválida o expiró, lanzará error automáticamente
    return jwt.verify(token, config.secretKey)
  } catch (error) {
    throw new Error('Token inválido o expirado')
  }
}

module.exports = { generarToken, verificarToken }
