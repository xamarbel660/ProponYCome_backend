// campañasRoutes.js
const express = require('express')
const router = express.Router()
const recetaController = require('../controllers/recetaController')
const { protegerRuta } = require('../middlewares/authMiddleware')

router.post('/', protegerRuta, recetaController.recuperarRecetas)
router.post('/paginadas', protegerRuta, recetaController.recuperarRecetasPaginadas)
router.post('/new', protegerRuta, recetaController.crearReceta)
router.put('/update', protegerRuta, recetaController.actualizarReceta)
router.post('/:id_receta', protegerRuta, recetaController.recuperarRecetaPorId)
router.delete('/:id_receta', protegerRuta, recetaController.eliminarReceta)

module.exports = router
