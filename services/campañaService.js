// services/directorService.js
// Servicio para interactuar con el modelo Sequelize `directors`

// Recuperar función de inicialización de modelos
const initModels = require("../models/init-models.js").initModels;
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require("../config/sequelize.js");
// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize);
// Recuperar el modelo director
const Camapaña = models.campana;
const Donacion = models.donacion;

const { Op } = require("sequelize");

class CampañaService {
  async getAllCampañas(filtros) {
    // Devuelve todos las campañas.
    const whereClause = {};
    if (filtros) {

      if (filtros.nombre_campana) {
        whereClause.nombre_campana = {
          [Op.like]: `%${filtros.nombre_campana}%` // %texto% busca coincidencias parciales
        };
      }

      if (filtros.objetivo_litros_campana_min && filtros.objetivo_litros_campana_max) {
        whereClause.objetivo_litros_campana = {
          [Op.between]: [filtros.objetivo_litros_campana_min, filtros.objetivo_litros_campana_max] // Entre min y max
        };
      } else if (filtros.objetivo_litros_campana_min) {
        whereClause.objetivo_litros_campana = {
          [Op.gte]: [filtros.objetivo_litros_campana_min] // Mayor o igual que
        };
      } else if (filtros.objetivo_litros_campana_max) {
        whereClause.objetivo_litros_campana = {
          [Op.lte]: [filtros.objetivo_litros_campana_max] // Menor o igual que
        };
      }

      if (filtros.fecha_inicio_campana) {
        whereClause.fecha_inicio_campana = {
          [Op.gte]: filtros.fecha_inicio_campana // Mayor o igual que
        };
      }

      if (filtros.fecha_fin_campana) {
        whereClause.fecha_fin_campana = {
          [Op.lte]: filtros.fecha_fin_campana // Menor o igual que
        };
      }

      if (filtros.urgente_campana !== undefined) {
        // Convertimos el string "true" a boolean true
        whereClause.urgente_campana = (filtros.urgente_campana === 'true');
      }
    }

    const result = await Camapaña.findAll(
      {
        where: whereClause,
        order: [['id_campana', 'ASC']],
      });

    return result;

  }

  async getCampañaDataGraph() {
    const result = await Donacion.findAll({
      attributes: [
        "id_campana",
        // Contamos las donaciones. Usamos 'id_donacion' que es la PK
        [sequelize.fn("COUNT", sequelize.col("donacion.id_donacion")), "total"],
      ],
      include: [
        {
          model: Camapaña,
          as: "id_campana_campaña", // <--- Nombre de la FK
          attributes: ["nombre_campana"], // Solo traemos el nombre para la gráfica
        },
      ],
      // Agrupamos por el ID y por el nombre (accediendo a través del nombre de la FK)
      group: ["donacion.id_campana", "id_campana_campaña.nombre_campana", "id_campana_campaña.id_campana"],
      raw: true,
    });
    return result;
  }

  async getCampañaById(id_campana) {
    // Devuelve una campana por su id
    const result = await Camapaña.findByPk(id_campana);
    return result;
  }

  async createCampaña(campana) {
    //Crea una campana
    const result = await Camapaña.create(campana);
    return result;
  }

  async deleteCampaña(id_campaña) {
    const result = await Camapaña.destroy({
      //Es sin ñ porque en la base de datos está sin ñ
      where: {
        id_campana: id_campaña,
      },
    });
    return result;
  }

  async updateCampaña(campana) {
    const numFilas = await Camapaña.update(campana,
      {
        where:
          { id_campana: campana.id_campana, }
      });
    return numFilas;
  }
}

module.exports = new CampañaService();
