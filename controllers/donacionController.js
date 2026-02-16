// controllers/directorController.js
const { logMensaje } = require("../utils/logger.js");
const donacionService = require("../services/donacionService.js");

class DonacionController {
  async getAllDonaciones(req, res) {
    try {
      //Recupero todos los parametros de la consulta, si lo hubiera
      const filtros = req.query;

      const donaciones = await donacionService.getAllDonaciones(filtros);
      return res.status(200).json({
        ok: true,
        datos: donaciones,
        mensaje: "Donaciones recuperadas correctamente",
      });
    } catch (err) {
      logMensaje("Error en getAllDonaciones:", err);
      return res.status(500).json({
        ok: false,
        datos: null,
        mensaje: "Error al recuperar donaciones",
      });
    }
  }

    async getAllDonacionesCards(req, res) {
    try {
      const page = parseInt(req.params.page) || 1;
      const size = 10;

      const donaciones = await donacionService.getAllDonacionesCards(page, size);
      const totalRegistros = donaciones.count;
      //Porque devuelve un count y luego rows
      const donacioneslimpio = donaciones.rows;

      return res.status(200).json({
        ok: true,
        pagination: {
          page: page,
          totalPages: Math.ceil(totalRegistros / size)
        },
        datos: donacioneslimpio,
        mensaje: "Donaciones recuperadas correctamente",
      });
    } catch (err) {
      logMensaje("Error en getAllDonacionesCards:", err);
      return res.status(500).json({
        ok: false,
        datos: null,
        mensaje: "Error al recuperar donaciones",
      });
    }
  }

  async getDonacionById(req, res) {
    const id_donacion = req.params.id;
    try {
      const donacion = await donacionService.getDonacionById(id_donacion);
      // donacion != null -- se ha encontrado la donación
      if (donacion) {
        return res.status(200).json({
          ok: true,
          datos: donacion,
          mensaje: "Donación recuperada correctamente",
        });
      } else {
        return res.status(404).json({
          ok: false,
          datos: null,
          mensaje: "Donación no encontrada",
        });
      }
    } catch (err) {
      logMensaje("Error en getDonacionById:", err);
      return res.status(500).json({
        ok: false,
        datos: null,
        mensaje: "Error al recuperar una donación",
      });
    }
  }

  async createDonacion(req, res) {
    const donacion = req.body;

    try {
      const donacionNew = await donacionService.createDonacion(donacion);
      return res.status(201).json({
        ok: true,
        datos: donacionNew,
        mensaje: "Donación creada correctamente",
      });

    } catch (err) {
      logMensaje("Error en createDonacion:", err);
      return res.status(500).json({
        ok: false,
        datos: null,
        mensaje: "Error al crear una donación",
      });
    }
  }

  async deleteDonacion(req, res) {
    const id_donacion = req.params.id;

    try {
      const numFilas = await donacionService.deleteDonacion(id_donacion);
      if (numFilas == 0) {
        return res.status(404).json({
          ok: false,
          datos: null,
          mensaje: "No encontrado: " + id_donacion
        });
      } else {
        return res.status(204).send();
      }

    } catch (err) {
      logMensaje("Error :" + err);
      return res
        .status(500)
        .json({
          ok: false,
          datos: null,
          mensaje: `Error al eliminar los datos: ${req.originalUrl}`
        });
    }
  }

  async updateDonacion(req, res) {
    const donacion = req.body; // Recuperamos datos para actualizar
    const idDonacion = req.params.id; // dato de la ruta

    // Petición errónea, no coincide el id del plato de la ruta con el del objeto a actualizar
    if (idDonacion != donacion.id_donacion) {
      return res
        .status(400)
        .json({
          ok: false,
          datos: null,
          mensaje: "El id de la donación no coincide"
        });
    }

    try {
      const numFilas = await donacionService.updateDonacion(donacion);

      if (numFilas == 0) {
        // No se ha encontrado lo que se quería actualizar o no hay nada que cambiar
        return res
          .status(404)
          .json({
            ok: false,
            datos: null,
            mensaje: "No encontrado o no modificado: " + idDonacion
          });
      } else {
        // Al dar status 204 no se devuelva nada
        // res.status(204).json(Respuesta.exito(null, "Plato actualizado"));
        return res.status(204).send();
      }
    } catch (err) {
      logMensaje("Error :" + err);
      res
        .status(500)
        .json({
          ok: false,
          datos: null,
          mensaje: `Error al actualizar los datos: ${req.originalUrl}`
        });
    }
  }

}

module.exports = new DonacionController();