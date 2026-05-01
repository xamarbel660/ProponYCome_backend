// services/usuarioService.js
// Servicio para interactuar con el modelo Sequelize `usuario`

// Recuperar función de inicialización de modelos
const initModels = require('../models/init-models.js').initModels
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require('../config/sequelize.js')
// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize)
// Recuperar el modelo director
const Ingrediente = models.ingrediente

class RecetaService {
  async recuperarIngredientes () {
    const ingredientes = await Ingrediente.findAll({
      attributes: [
        'id_ingrediente',
        'nombre_ingrediente'
      ],
      raw: true
    })
    return { ingredientes }
  }
}

module.exports = new RecetaService()
