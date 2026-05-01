const express = require('express')
const router = express.Router()
const ingredienteController = require('../controllers/ingredienteController')
const { protegerRuta } = require('../middlewares/authMiddleware')

router.post('/', protegerRuta, ingredienteController.recuperarIngredientes)

module.exports = router
