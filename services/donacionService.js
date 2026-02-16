// services/directorService.js
// Servicio para interactuar con el modelo Sequelize `donacion`

// Recuperar función de inicialización de modelos
const initModels = require("../models/init-models.js").initModels;
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require("../config/sequelize.js");
// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize);
// Recuperar el modelo director
const Donacion = models.donacion;
const Camapaña = models.campana;

const { Op } = require("sequelize");

class DonacionService {
    async getAllDonaciones(filtros) {

        const whereClause = {};
        if (filtros) {
            if (filtros.id_campana) {
                whereClause.id_campana = filtros.id_campana;
            }

            if (filtros.nombre_donante) {
                whereClause.nombre_donante = {
                    [Op.like]: `%${filtros.nombre_donante}%`
                };
            }

            if (filtros.peso_donante_min && filtros.peso_donante_max) {
                whereClause.peso_donante = {
                    [Op.between]: [filtros.peso_donante_min, filtros.peso_donante_max] // Entre min y max
                };
            } else if (filtros.peso_donante_min) {
                whereClause.peso_donante = {
                    [Op.gte]: [filtros.peso_donante_min] // Mayor o igual que
                };
            } else if (filtros.peso_donante_max) {
                whereClause.peso_donante = {
                    [Op.lte]: [filtros.peso_donante_max] // Menor o igual que
                };
            }

            if (filtros.fecha_donacion_min && filtros.fecha_donacion_max) {
                whereClause.fecha_donacion = {
                    [Op.between]: [filtros.fecha_donacion_min, filtros.fecha_donacion_max] // Entre min y max
                };
            } else if (filtros.fecha_donacion_min) {
                whereClause.fecha_donacion = {
                    [Op.gte]: filtros.fecha_donacion_min // Mayor o igual que
                };
            } else if (filtros.fecha_donacion_max) {
                whereClause.fecha_donacion = {
                    [Op.lte]: filtros.fecha_donacion_max // Menor o igual que
                };
            }

            if (filtros.grupo_sanguineo) {
                whereClause.grupo_sanguineo = {
                    [Op.like]: `%${filtros.grupo_sanguineo}%`
                };
            }
        }

        const result = await Donacion.findAll({
            where: whereClause,
            include: [{
                model: Camapaña, // Esto hace el "JOIN campaña c"
                as: 'id_campana_campaña',

                // "SELECT c.nombre_campana"
                attributes: ['nombre_campana'],

                // Convierte el LEFT JOIN (por defecto) en INNER JOIN
                required: true
            }],
            order: [['id_donacion', 'ASC']],
            // raw: true  //
        });
        return result;
    }

    async getAllDonacionesCards(page, size) {
        const limit = parseInt(size);
        const offset = (parseInt(page) - 1) * limit;

        const result = await Donacion.findAndCountAll({
            include: [{
                model: Camapaña, // Esto hace el "JOIN campaña c"
                as: 'id_campana_campaña',

                // "SELECT c.nombre_campana"
                attributes: ['nombre_campana'],

                // Convierte el LEFT JOIN (por defecto) en INNER JOIN
                required: true
            }],
            // 4. APLICAMOS EL CORTE
            limit: limit,
            offset: offset,

            // 5. ORDEN (Opcional pero recomendado)
            // Es importante ordenar, si no la paginación puede salir desordenada
            order: [['id_donacion', 'ASC']],
            // raw: true  //
        });
        return result;
    }

    async getDonacionById(id_donacion) {
        // Devuelve una donación por su id
        const result = await Donacion.findByPk(id_donacion);
        return result;
    }

    async createDonacion(donacion) {
        //Crea una donación
        const result = await Donacion.create(donacion);
        return result;
    }

    async deleteDonacion(id_donacion) {
        const result = await Donacion.destroy({
            where: {
                id_donacion: id_donacion,
            },
        });
        return result;
    }

    async updateDonacion(donacion) {
        const numFilas = await Donacion.update(donacion,
            {
                where:
                    { id_donacion: donacion.id_donacion, }
            });
        return numFilas;
    }
}

module.exports = new DonacionService();