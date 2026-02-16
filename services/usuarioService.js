// services/usuarioService.js
// Servicio para interactuar con el modelo Sequelize `usuario`

// Recuperar función de inicialización de modelos
const initModels = require('../models/init-models.js').initModels
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require('../config/sequelize.js')
// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize)
// Recuperar el modelo director
const Usuario = models.usuario

// const { Op } = require('sequelize')
const bcrypt = require('bcrypt')

class UsuarioService {
  async loginUsuario (usuarioBody) {
    const usuario = await Usuario.findOne({ where: { email: usuarioBody.email } })
    if (!usuario) {
      throw new Error('Usuario no encontrado')
    }
    const passwordMatch = await bcrypt.compare(usuarioBody.password_hash, usuario.password_hash)
    if (!passwordMatch) {
      throw new Error('Contraseña incorrecta')
    }
    return usuario
  }

  async registerUsuario (usuario) {
    // Asegurar que el usuario no existe
    const usuarioExistente = await Usuario.findOne({ where: { email: usuario.email } })
    if (usuarioExistente) {
      throw new Error('El usuario ya existe')
    }

    // Generamos el id_usuario con randomUUID de crypto
    usuario.id_usuario = crypto.randomUUID()
    // Generamos el hash de la contraseña con bcrypt
    usuario.password_hash = bcrypt.hash(usuario.password_hash, 10)

    const result = await Usuario.create(usuario)
    return result
  }
}

module.exports = new UsuarioService()
