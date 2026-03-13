const { verificarToken } = require('../utils/jwt')

const protegerRuta = (req, res, next) => {
  // Capturamos la cabecera de autorización que nos manda api.js
  const authHeader = req.headers.authorization

  // Comprobamos si nos mandan la cabecera y si empieza por "Bearer "
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      ok: false,
      datos: null,
      mensaje: 'Acceso denegado: No se proporcionó un token válido'
    })
  }

  // Extraemos el token quitando la palabra "Bearer "
  const token = authHeader.split(' ')[1]

  try {
    // Usamos tu función para descifrar el token
    // Si el token es falso o caducó, esto lanzará un error y saltará al catch
    const payload = verificarToken(token)

    // Guardamos los datos del token dentro de la petición (req)
    req.usuario = payload

    // Le abrimos la puerta al controlador
    next()
  } catch (error) {
    // Si el token falló, respondemos un 401 (No Autorizado)
    return res.status(401).json({
      ok: false,
      datos: null,
      mensaje: 'Token inválido o expirado. Por favor, inicia sesión de nuevo.'
    })
  }
}

module.exports = { protegerRuta }
