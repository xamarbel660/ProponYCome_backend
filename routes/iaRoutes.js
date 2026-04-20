const express = require('express')
const router = express.Router()
const iaController = require('../controllers/iaController')
const { protegerRuta } = require('../middlewares/authMiddleware')

router.post('/', protegerRuta, iaController.recuperarRecetasIa)

module.exports = router
