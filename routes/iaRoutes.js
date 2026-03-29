const express = require('express')
const router = express.Router()
const iaController = require('../controllers/iaController')
const { protegerRuta } = require('../middlewares/authMiddleware')

router.post('/', protegerRuta, iaController.recuperarRecetasIa)
// router.post('/new', protegerRuta, iaController.crearIA)
// router.post('/update', protegerRuta, iaController.actualizarIA)
// router.post('/delete', protegerRuta, iaController.eliminarIA)

module.exports = router
