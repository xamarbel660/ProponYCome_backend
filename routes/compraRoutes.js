const express = require('express')
const router = express.Router()
const compraController = require('../controllers/compraController')
const { protegerRuta } = require('../middlewares/authMiddleware')

router.post('/:idFamilia/:fechaLunes', protegerRuta, compraController.recuperarIngredientesHaComprar)
router.put('/items/:idItem', protegerRuta, compraController.actualizarEstadoItem)

module.exports = router
