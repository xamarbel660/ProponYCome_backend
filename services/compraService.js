// Recuperar función de inicialización de modelos
const initModels = require('../models/init-models.js').initModels
const { Op } = require('sequelize')
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require('../config/sequelize.js')
// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize)
// Cargamos los modelos necesarios
const ListaCompra = models.listaCompra
const ListaCompraItem = models.listaCompraItem
const Planning = models.planning
const Receta = models.receta
const Ingrediente = models.ingrediente

class CompraService {
  async recuperarIngredientesHaComprar(idFamilia, fechaLunes) {
    // Calcular fecha domingo (lunes + 6 días) para el filtrado del planning
    const lunes = new Date(fechaLunes) // Formato esperado: 'YYYY-MM-DD'
    lunes.setHours(0, 0, 0, 0)
    const domingo = new Date(lunes)
    domingo.setDate(lunes.getDate() + 6)
    domingo.setHours(23, 59, 59, 999)

    // Recuperar lista existente
    const lista = await ListaCompra.findOne({
      where: {
        id_familia: idFamilia,
        fecha_generacion: { [Op.between]: [lunes, domingo] }
      },
      order: [['fecha_generacion', 'DESC']],
      include: [{
        model: ListaCompraItem,
        as: 'LISTA_COMPRA_ITEMs'
      }]
    })

    if (lista) return lista

    // Si no existe, generar desde Planning
    const planesAprobados = await Planning.findAll({
      where: {
        id_familia: idFamilia,
        fecha: { [Op.between]: [lunes, domingo] },
        estado: 'APROBADO'
      },
      include: [{
        model: Receta,
        as: 'id_receta_RECETum',
        include: [{
          model: Ingrediente,
          as: 'id_ingrediente_INGREDIENTEs',
          through: { attributes: ['cantidad', 'unidad'] }
        }]
      }]
    })

    // Agrupar y sumar ingredientes
    const mapaIngredientes = {}

    planesAprobados.forEach(plan => {
      if (!plan.id_receta_RECETum) return

      plan.id_receta_RECETum.id_ingrediente_INGREDIENTEs.forEach(ing => {
        const nombre = ing.nombre_ingrediente
        const unidad = ing.recetaIngrediente.unidad
        const clave = `${nombre}-${unidad}`.toLowerCase()

        if (!mapaIngredientes[clave]) {
          mapaIngredientes[clave] = {
            nombre_ingrediente: nombre,
            cantidad_total: 0,
            unidad: unidad,
            comprado: 0
          }
        }
        mapaIngredientes[clave].cantidad_total += parseFloat(ing.recetaIngrediente.cantidad)
      })
    })

    // Guardar en BD con Transacción
    const t = await sequelize.transaction()
    try {
      const nuevaLista = await ListaCompra.create({
        id_familia: idFamilia,
        fecha_generacion: fechaLunes
      }, { transaction: t })

      const items = Object.values(mapaIngredientes).map(item => ({
        nombre_producto: item.nombre_ingrediente,
        cantidad: item.cantidad_total,
        unidad: item.unidad,
        comprado: item.comprado,
        es_manual: 0,
        id_lista: nuevaLista.id_lista
      }))

      await ListaCompraItem.bulkCreate(items, { transaction: t })
      await t.commit()

      // Devolver la lista completa recién creada
      return await ListaCompra.findByPk(nuevaLista.id_lista, {
        include: [{ model: ListaCompraItem, as: 'LISTA_COMPRA_ITEMs' }]
      })
    } catch (error) {
      await t.rollback()
      throw error
    }
  }

  async actualizarEstadoItem(idItem, comprado) {
    const item = await ListaCompraItem.findByPk(idItem)
    if (!item) throw new Error('Item no encontrado')

    if (typeof comprado !== 'boolean') {
      throw new Error('El campo comprado debe ser booleano')
    }

    item.comprado = comprado ? 1 : 0

    await item.save()
    return item
  }
}

module.exports = new CompraService()
