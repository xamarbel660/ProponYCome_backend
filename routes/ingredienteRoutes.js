const express = require('express')
const router = express.Router()
const ingredienteController = require('../controllers/ingredienteController')
const { protegerRuta } = require('../middlewares/authMiddleware')

router.post('/', protegerRuta, ingredienteController.recuperarIngredientes)
// router.post('/new', protegerRuta, ingredienteController.crearIngrediente)
// router.post('/update', protegerRuta, ingredienteController.actualizarIngrediente)
// router.post('/delete', protegerRuta, ingredienteController.eliminarIngrediente)

module.exports = router
