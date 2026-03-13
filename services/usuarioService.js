// Servicio para interactuar con el modelo Sequelize `usuario`

// Recuperar función de inicialización de modelos
const initModels = require('../models/init-models.js').initModels
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require('../config/sequelize.js')
// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize)
// Recuperar el modelo director
const Usuario = models.usuario
// Usamos bcrypt para encriptar y comparar la contraseña
const bcrypt = require('bcrypt')
// Usamos generarToken para generar el token
const { generarToken } = require('../utils/jwt.js')

class UsuarioService {
  async loginUsuario (usuarioBody) {
    // Buscamos el usuario por email
    const usuario = await Usuario.findOne({ where: { email: usuarioBody.email } })
    if (!usuario) {
      throw new Error('Usuario no encontrado')
    }
    // Comparamos la contraseña
    const passwordMatch = await bcrypt.compare(usuarioBody.password_hash, usuario.password_hash)
    if (!passwordMatch) {
      throw new Error('Contraseña incorrecta')
    }
    // Generamos el token
    const token = generarToken(usuario)
    return { usuario, token }
  }

  async registerUsuario (usuario) {
    // Buscamos si el usuario existe
    const usuarioExistente = await Usuario.findOne({ where: { email: usuario.email } })
    if (usuarioExistente) {
      throw new Error('Ya hay un usuario usando el correo proporcionado')
    }

    // Generamos el id_usuario con randomUUID de crypto
    usuario.id_usuario = crypto.randomUUID()
    // Generamos el hash de la contraseña con bcrypt
    usuario.password_hash = await bcrypt.hash(usuario.password_hash, 10)

    const usuarioNew = await Usuario.create(usuario)
    // Generamos el token
    const token = generarToken(usuarioNew)
    return { usuarioNew, token }
  }
}

module.exports = new UsuarioService()
