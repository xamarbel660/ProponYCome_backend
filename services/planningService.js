// Recuperar función de inicialización de modelos
const initModels = require('../models/init-models.js').initModels
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require('../config/sequelize.js')
// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize)
const { Op } = require('sequelize')
const Planning = models.planning
const Usuario = models.usuario
const Receta = models.receta
const UsuarioFamilia = models.usuarioFamilia

class PlanningService {
  async recuperarPropuestasSemanal(usuarioRecuperado, datosPropuestas) {
    // Verificar que el usuario pertenece a la familia
    const usuarioEnFamilia = await UsuarioFamilia.findOne({
      where: {
        id_familia: datosPropuestas.id_familia,
        id_usuario: usuarioRecuperado.id_usuario
      }
    })

    if (!usuarioEnFamilia) {
      throw new Error('El usuario no pertenece a la familia')
    }

    const propuestasSemanal = await Planning.findAll({
      attributes: ['id_planning', 'fecha', 'turno_comida', 'id_familia', 'estado'],
      where: {
        id_familia: datosPropuestas.id_familia,
        fecha: {
          [Op.between]: [datosPropuestas.fecha_inicio, datosPropuestas.fecha_fin]
        },
        estado: {
          [Op.ne]: 'RECHAZADO'
        }
      },
      include: [
        {
          model: Usuario,
          as: 'id_usuario_propone_USUARIO',
          attributes: ['id_usuario', 'nombre']
        },
        {
          model: Receta,
          as: 'id_receta_RECETum',
          attributes: ['id_receta', 'titulo', 'dificultad'],
          required: false
        }
      ]
    })

    return propuestasSemanal.map((propuesta) => ({
      id_planning: propuesta.id_planning,
      fecha: propuesta.fecha,
      turno_comida: propuesta.turno_comida,
      id_familia: propuesta.id_familia,
      usuario: propuesta.id_usuario_propone_USUARIO
        ? {
            id_usuario_propone: propuesta.id_usuario_propone_USUARIO.id_usuario,
            nombre: propuesta.id_usuario_propone_USUARIO.nombre
          }
        : null,
      receta: propuesta.id_receta_RECETum
        ? {
            id_receta: propuesta.id_receta_RECETum.id_receta,
            titulo: propuesta.id_receta_RECETum.titulo,
            dificultad: propuesta.id_receta_RECETum.dificultad
          }
        : null,
      estado: propuesta.estado
    }))
  }

  async crearPropuesta(usuarioRecuperado, propuesta) {
    // Verificar que el usuario pertenece a la familia
    const usuarioEnFamilia = await UsuarioFamilia.findOne({
      where: {
        id_familia: propuesta.id_familia,
        id_usuario: usuarioRecuperado.id_usuario
      }
    })

    if (!usuarioEnFamilia) {
      throw new Error('El usuario no pertenece a la familia')
    }

    // Verificar que el usuario no haya propuesto ya para ese turno, dia y familia
    const propuestaExistente = await Planning.findOne({
      where: {
        id_usuario_propone: usuarioRecuperado.id_usuario,
        id_familia: propuesta.id_familia,
        fecha: propuesta.fecha,
        turno_comida: propuesta.turno_comida,
        estado: {
          [Op.ne]: 'RECHAZADO'
        }
      }
    })

    if (propuestaExistente) {
      throw new Error('El usuario ya ha propuesto una receta para ese turno')
    }

    // Crear la propuesta
    const resultado = await Planning.create({
      fecha: propuesta.fecha,
      turno_comida: propuesta.turno_comida,
      id_familia: propuesta.id_familia,
      id_usuario_propone: usuarioRecuperado.id_usuario,
      id_receta: propuesta.id_receta
    })

    return resultado
  }

  async estadoPropuesta(usuarioRecuperado, respuestaAdmin) {
    // Verificar que el usuario pertenece a la familia
    const usuarioEnFamilia = await UsuarioFamilia.findOne({
      where: {
        id_usuario: usuarioRecuperado.id_usuario,
        id_familia: respuestaAdmin.id_familia
      }
    })

    if (!usuarioEnFamilia) {
      throw new Error('El usuario no pertenece a la familia')
    }

    // Verificar que el usuario es admin de la familia
    if (!usuarioEnFamilia.es_administrador) {
      throw new Error('El usuario no tiene permisos para responder a la propuesta')
    }

    // Verificar que la propuesta ya no esté aprobada o rechazada
    const propuesta = await Planning.findOne({
      where: {
        id_planning: respuestaAdmin.id_planning
      }
    })

    if (!propuesta) {
      throw new Error('La propuesta no existe')
    }
    if (propuesta.estado !== 'PENDIENTE') {
      throw new Error('La propuesta ya ha sido respondida')
    }

    // Poner estado de la propuesta (acepta string APROBADO/RECHAZADO)
    let estadoPropuesta
    if (typeof respuestaAdmin.estado === 'string') {
      const estadoNormalizado = respuestaAdmin.estado.toUpperCase()
      if (estadoNormalizado !== 'APROBADO' && estadoNormalizado !== 'RECHAZADO') {
        throw new Error('Estado de propuesta no valido')
      }
      estadoPropuesta = estadoNormalizado
    } else {
      throw new Error('Estado de propuesta no valido')
    }

    const resultado = await Planning.update(
      { estado: estadoPropuesta },
      {
        where: {
          id_planning: respuestaAdmin.id_planning
        }
      }
    )

    // Rechazamos las demas propuestas para ese dia y turno si se ha aprobado la propuesta
    if (estadoPropuesta === 'APROBADO') {
      await Planning.update(
        { estado: 'RECHAZADO' },
        {
          where: {
            id_familia: respuestaAdmin.id_familia,
            fecha: propuesta.fecha,
            turno_comida: propuesta.turno_comida,
            id_planning: { [Op.ne]: respuestaAdmin.id_planning }
          }
        }
      )
    }

    return resultado
  }
}
module.exports = new PlanningService()
