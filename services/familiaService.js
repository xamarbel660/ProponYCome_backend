// Recuperar función de inicialización de modelos
const initModels = require('../models/init-models.js').initModels
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require('../config/sequelize.js')
// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize)
const generarCodigoInvitacion = require('../utils/generarCodigoInvitacion')
// Modelos que vamos a usar en este servicio
const Familia = models.familia
const UsuarioFamilia = models.usuarioFamilia
const Usuario = models.usuario

class FamiliaService {
  async recuperarFamilias(usuarioRecuperado) {
    // Obtener todas las familias en las que el usuario es miembro
    const familias = await Familia.findAll({
      attributes: [
        'id_familia',
        'nombre_familia',
        'codigo_invitacion'
      ],
      include: [
        {
          model: UsuarioFamilia,
          as: 'USUARIO_FAMILIa',
          attributes: ['es_administrador', 'id_usuario'],
          required: true,
          where: { id_usuario: usuarioRecuperado.id_usuario }
        }
      ],
      raw: true
    })

    // Para cada familia, obtener la cantidad de miembros y el nombre del creador
    const resultado = await Promise.all(familias.map(async fam => {
      // Contar todos los miembros de la familia
      const cantidadMiembros = await UsuarioFamilia.count({
        where: { id_familia: fam.id_familia }
      })

      // Obtener el usuario administrador (creador) de la familia
      const adminRelacion = await UsuarioFamilia.findOne({
        where: { id_familia: fam.id_familia, es_administrador: true },
        attributes: ['id_usuario']
      })

      let nombreCreador = null
      if (adminRelacion) {
        const usuario = await Usuario.findOne({
          where: { id_usuario: adminRelacion.id_usuario },
          attributes: ['nombre']
        })
        nombreCreador = usuario ? usuario.nombre : null
      }

      return {
        id_familia: fam.id_familia,
        nombre_familia: fam.nombre_familia,
        codigo_invitacion: fam.codigo_invitacion,
        cantidadMiembros,
        es_admin: fam['USUARIO_FAMILIa.es_administrador'] || false,
        nombreCreador
      }
    }))
    return resultado
  }

  async recuperarFamiliasPaginadas(usuarioRecuperado, page, limit) {
    const offset = (page - 1) * limit

    // Primero contamos el total de familias en las que el usuario es miembro
    const totalFamilias = await Familia.count({
      include: [
        {
          model: UsuarioFamilia,
          as: 'USUARIO_FAMILIa',
          where: { id_usuario: usuarioRecuperado.id_usuario },
          required: true
        }
      ],
      distinct: true
    })

    // Luego recuperamos solo las familias de esta página
    const familias = await Familia.findAll({
      attributes: [
        'id_familia',
        'nombre_familia',
        'codigo_invitacion'
      ],
      include: [
        {
          model: UsuarioFamilia,
          as: 'USUARIO_FAMILIa',
          attributes: ['es_administrador', 'id_usuario'],
          required: true,
          where: { id_usuario: usuarioRecuperado.id_usuario }
        }
      ],
      limit,
      offset,
      order: [['id_familia', 'ASC']],
      raw: true
    })

    // Para cada familia, obtener la cantidad de miembros y el nombre del creador
    const familiasFormateadas = await Promise.all(familias.map(async fam => {
      // Contar todos los miembros de la familia
      const cantidadMiembros = await UsuarioFamilia.count({
        where: { id_familia: fam.id_familia }
      })

      // Obtener el usuario administrador (creador) de la familia
      const adminRelacion = await UsuarioFamilia.findOne({
        where: { id_familia: fam.id_familia, es_administrador: true },
        attributes: ['id_usuario']
      })

      let nombreCreador = null
      if (adminRelacion) {
        const usuario = await Usuario.findOne({
          where: { id_usuario: adminRelacion.id_usuario },
          attributes: ['nombre']
        })
        nombreCreador = usuario ? usuario.nombre : null
      }

      return {
        id_familia: fam.id_familia,
        nombre_familia: fam.nombre_familia,
        codigo_invitacion: fam.codigo_invitacion,
        cantidadMiembros,
        es_admin: fam['USUARIO_FAMILIa.es_administrador'] || false,
        nombreCreador
      }
    }))

    return { familias: familiasFormateadas, total: totalFamilias }
  }

  async recuperarFamiliaPorId(idFamilia, usuarioRecuperado) {
    // Verificar si el usuario pertenece a la familia
    const usuarioEnFamilia = await UsuarioFamilia.findOne({
      where: {
        id_familia: idFamilia,
        id_usuario: usuarioRecuperado.id_usuario
      }
    })

    if (!usuarioEnFamilia) return null

    // Obtener la familia
    const familiaBd = await Familia.findOne({
      where: { id_familia: idFamilia }
    })

    if (!familiaBd) return null

    // Obtener todos los miembros de la familia con sus datos
    const miembros = await UsuarioFamilia.findAll({
      where: { id_familia: idFamilia },
      include: [
        {
          model: Usuario,
          as: 'id_usuario_USUARIO',
          attributes: ['id_usuario', 'nombre']
        }
      ]
    })

    // Mapeamos los datos al formato solicitado
    const familiaFormateada = {
      id_familia: familiaBd.id_familia,
      nombre_familia: familiaBd.nombre_familia,
      codigo_invitacion: familiaBd.codigo_invitacion
    }

    // Mapear usuarios con id y nombre, incluyendo si es admin
    const usuariosFormateados = miembros.map((miembro) => ({
      id_usuario: miembro.id_usuario_USUARIO.id_usuario,
      nombre_usuario: miembro.id_usuario_USUARIO.nombre,
      es_administrador: miembro.es_administrador,
      es_actual: miembro.id_usuario_USUARIO.id_usuario === usuarioRecuperado.id_usuario
    }))

    const payload = {
      familia: familiaFormateada,
      usuarios: usuariosFormateados,
      admin: !!usuarioEnFamilia.es_administrador
    }

    return payload
  }

  async crearFamilia(familia, usuarioRecuperado) {
    // Iniciamos la transacción
    const t = await sequelize.transaction()

    try {
      // Creamos la familia (le pasamos la transacción)
      // En familia solo viene el nombre_familia

      // Generamos el id_familia con randomUUID de crypto
      familia.id_familia = crypto.randomUUID()

      let codigoUnico = null
      let codigoEsValido = false

      // Genera código hasta encontrar uno que NO esté en la base de datos
      while (!codigoEsValido) {
        const codigoPrueba = generarCodigoInvitacion()

        // Buscamos si ese código ya existe en alguna familia
        const familias = await Familia.findOne({
          where: { codigo_invitacion: codigoPrueba },
          transaction: t
        })

        // Si no existe, lo guardamos
        if (!familias) {
          codigoUnico = codigoPrueba
          codigoEsValido = true
        }
      }

      familia.codigo_invitacion = codigoUnico
      const familiaCreada = await Familia.create(familia, { transaction: t })

      // Creamos la relación
      await UsuarioFamilia.create(
        {
          id_familia: familiaCreada.id_familia,
          id_usuario: usuarioRecuperado.id_usuario,
          es_administrador: true
        },
        { transaction: t }
      )

      // Si todo ha ido bien, guardamos los cambios en la base de datos definitivamente
      await t.commit()

      return familiaCreada
    } catch (error) {
      // Si falla cualquier cosa (ej. falta la cantidad), deshacemos TODO para no dejar datos a medias
      await t.rollback()
      console.error('Error al crear la familia y sus usuarios:', error)
      // Lanzamos el error para que el controlador lo capture y devuelva un status 500 al frontend
      throw error
    }
  }

  async actualizarCodigoInvitacion(idFamilia, usuarioRecuperado) {
    try {
      // Buscamos la familia por el código de invitación
      const familia = await Familia.findOne({
        where: { id_familia: idFamilia }
      })

      if (!familia) {
        throw new Error('No se encontró ninguna familia con ese ID.')
      }

      // Comprobamos si el usuario pertenece a la familia y es ADMIN
      const admin = await UsuarioFamilia.findOne({
        where: {
          id_familia: idFamilia,
          id_usuario: usuarioRecuperado.id_usuario,
          es_administrador: true
        }
      })

      if (!admin) {
        throw new Error('Solo los administradores pueden actualizar el código de invitación.')
      }

      let codigoUnico = null
      let codigoEsValido = false

      // Genera código hasta encontrar uno que NO esté en la base de datos
      while (!codigoEsValido) {
        const codigoPrueba = generarCodigoInvitacion()

        // Buscamos si ese código ya existe en alguna familia
        const familias = await Familia.findOne({
          where: { codigo_invitacion: codigoPrueba }
        })

        // Si no existe, lo guardamos
        if (!familias) {
          codigoUnico = codigoPrueba
          codigoEsValido = true
        }
      }

      // Actualizamos el código de invitación de la familia
      await Familia.update(
        { codigo_invitacion: codigoUnico },
        { where: { id_familia: idFamilia } }
      )

      return codigoUnico
    } catch (error) {
      console.error('Error al unirse a la familia: ', error)
      // Lanzamos el error para que el controlador lo capture y devuelva un status 500 al frontend
      throw error
    }
  }

  async entrarFamilia(codigoInvitacion, usuarioRecuperado) {
    try {
      // Buscamos la familia por el código de invitación
      const familia = await Familia.findOne({
        where: { codigo_invitacion: codigoInvitacion }
      })

      if (!familia) {
        throw new Error('Código de invitación inválido. No se encontró ninguna familia con ese código.')
      }
      // Verificamos si el usuario ya pertenece a esa familia
      const relacionExistente = await UsuarioFamilia.findOne({
        where: {
          id_familia: familia.id_familia,
          id_usuario: usuarioRecuperado.id_usuario
        }
      })

      if (relacionExistente) {
        throw new Error('Ya perteneces a esta familia.')
      }

      // Creamos la relación
      await UsuarioFamilia.create({
        id_familia: familia.id_familia,
        id_usuario: usuarioRecuperado.id_usuario,
        es_administrador: false
      })

      return familia
    } catch (error) {
      console.error('Error al unirse a la familia: ', error)
      // Lanzamos el error para que el controlador lo capture y devuelva un status 500 al frontend
      throw error
    }
  }

  async actualizarFamilia(familia, usuarioRecuperado) {
    const t = await sequelize.transaction()

    try {
      familia.familia.id_usuario_creador = usuarioRecuperado.id_usuario

      await Familia.update(familia.familia, {
        where: {
          id_familia: familia.familia.id_familia,
          id_usuario_creador: usuarioRecuperado.id_usuario
        },
        transaction: t
      })

      await UsuarioFamilia.destroy({
        where: { id_familia: familia.familia.id_familia },
        transaction: t
      })

      for (const ing of familia.usuarios) {
        // Buscamos/Creamos el ingrediente global
        const [usuarioBd] = await Usuario.findOrCreate({
          where: { nombre_usuario: ing.nombre_usuario },
          transaction: t
        })

        // Creamos la relación nueva (¡Ahora el create sí tiene todo el sentido del mundo!)
        await UsuarioFamilia.create(
          {
            id_familia: familia.familia.id_familia, // Usamos el ID de la receta que nos llega
            id_usuario: usuarioBd.id_usuario,
            cantidad: ing.cantidad,
            unidad: ing.unidad
          },
          { transaction: t }
        )
      }

      await t.commit()

      // Devolvemos un mensaje de éxito
      return { mensaje: 'Familia actualizada correctamente' }
    } catch (error) {
      await t.rollback()
      console.error('Error al actualizar la familia y sus usuarios:', error)
      throw error
    }
  }

  async salirFamilia(idFamilia, usuarioRecuperado) {
    // Solo borramos el registro de la tabla intermedia (USUARIO_FAMILIA)
    // que coincida EXACTAMENTE con este usuario y esta familia.
    const result = await UsuarioFamilia.destroy({
      where: {
        id_familia: idFamilia,
        id_usuario: usuarioRecuperado.id_usuario
      }
    })

    // Si result es 0, significa que el usuario no estaba en esa familia
    if (result === 0) {
      throw new Error('No puedes salir de una familia a la que no perteneces.')
    }

    return result
  }

  async cambiarRolAdmin(idFamilia, idUsuarioObjetivo, esAdministrador, usuarioRecuperado) {
    if (typeof esAdministrador !== 'boolean') {
      throw new Error('El campo es_administrador debe ser booleano.')
    }

    // Solo un admin de la familia puede cambiar roles
    const admin = await UsuarioFamilia.findOne({
      where: {
        id_familia: idFamilia,
        id_usuario: usuarioRecuperado.id_usuario,
        es_administrador: true
      }
    })

    if (!admin) {
      throw new Error('Solo los administradores pueden cambiar roles en la familia.')
    }

    // No puede tocar su propio rol desde esta acción
    if (idUsuarioObjetivo === usuarioRecuperado.id_usuario) {
      throw new Error('No puedes cambiar tu propio rol de administrador.')
    }

    const miembroObjetivo = await UsuarioFamilia.findOne({
      where: {
        id_familia: idFamilia,
        id_usuario: idUsuarioObjetivo
      }
    })

    if (!miembroObjetivo) {
      throw new Error('El usuario objetivo no pertenece a esta familia.')
    }

    await UsuarioFamilia.update(
      { es_administrador: esAdministrador },
      {
        where: {
          id_familia: idFamilia,
          id_usuario: idUsuarioObjetivo
        }
      }
    )

    return {
      id_familia: idFamilia,
      id_usuario: idUsuarioObjetivo,
      es_administrador: esAdministrador
    }
  }

  async expulsarMiembro(idFamilia, idUsuarioObjetivo, usuarioRecuperado) {
    // Solo un admin de la familia puede expulsar miembros
    const admin = await UsuarioFamilia.findOne({
      where: {
        id_familia: idFamilia,
        id_usuario: usuarioRecuperado.id_usuario,
        es_administrador: true
      }
    })

    if (!admin) {
      throw new Error('Solo los administradores pueden expulsar miembros de la familia.')
    }

    // No puede expulsarse a sí mismo
    if (idUsuarioObjetivo === usuarioRecuperado.id_usuario) {
      throw new Error('No puedes expulsarte de la familia desde esta acción.')
    }

    const eliminados = await UsuarioFamilia.destroy({
      where: {
        id_familia: idFamilia,
        id_usuario: idUsuarioObjetivo
      }
    })

    if (eliminados === 0) {
      throw new Error('El usuario objetivo no pertenece a esta familia.')
    }

    return eliminados
  }

  async eliminarFamilia(idFamilia, usuarioRecuperado) {
    // Comprobamos si el usuario pertenece a la familia y es ADMIN
    const admin = await UsuarioFamilia.findOne({
      where: {
        id_familia: idFamilia,
        id_usuario: usuarioRecuperado.id_usuario,
        es_administrador: true // Solo los admins pueden borrar la familia entera
      }
    })

    // Si no lo encuentra, significa que o no es de la familia, o no es admin.
    if (!admin) {
      // Lanzamos un error. Tu controlador debería capturar esto y devolver un status 403 (Forbidden)
      throw new Error('No tienes permisos para eliminar esta familia o la familia no existe.')
    }

    // Si pasa el filtro, entonces SÍ destruimos la familia
    // En SQL esta puesto ON DELETE CASCADE, al borrar la familia
    // se borrarán automáticamente los registros asociados en USUARIO_FAMILIA, PLANNING, etc.
    const result = await Familia.destroy({
      where: {
        id_familia: idFamilia
      }
    })
    return result
  }
}

module.exports = new FamiliaService()
