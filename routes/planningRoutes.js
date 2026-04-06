const express = require('express')
const router = express.Router()
const planningController = require('../controllers/planningController')
const { protegerRuta } = require('../middlewares/authMiddleware')

router.post('/', protegerRuta, planningController.recuperarPropuestasSemanal)
router.post('/new', protegerRuta, planningController.crearPropuesta)
router.put('/estado', protegerRuta, planningController.estadoPropuesta)

module.exports = router
