const express = require('express')
const router = express.Router()
const familiaController = require('../controllers/familiaController')
const { protegerRuta } = require('../middlewares/authMiddleware')

router.post('/', protegerRuta, familiaController.recuperarFamilias)
router.post('/paginadas', protegerRuta, familiaController.recuperarFamiliasPaginadas)
router.post('/new', protegerRuta, familiaController.crearFamilia)
router.put('/update', protegerRuta, familiaController.actualizarFamilia)
router.post('/:id_familia', protegerRuta, familiaController.recuperarFamiliaPorId)
router.post('/actualizarCodigo/:id_familia', protegerRuta, familiaController.actualizarCodigoInvitacion)
router.post('/entrar/:codigo_invitacion', protegerRuta, familiaController.entrarFamilia)
router.post('/salir/:id_familia', protegerRuta, familiaController.salirFamilia)
router.post('/rol-admin/:id_familia/:id_usuario_objetivo', protegerRuta, familiaController.cambiarRolAdmin)
router.delete('/miembro/:id_familia/:id_usuario_objetivo', protegerRuta, familiaController.expulsarMiembro)
router.delete('/:id_familia', protegerRuta, familiaController.eliminarFamilia)

module.exports = router
