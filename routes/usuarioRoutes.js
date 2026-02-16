// campañasRoutes.js
const express = require('express')
const router = express.Router()
const usuarioController = require('../controllers/usuarioController')
const { validarRegistro, validarLogin } = require('../middlewares/authValidators')

router.post('/login', validarLogin, usuarioController.loginUsuario)
router.post('/register', validarRegistro, usuarioController.registerUsuario)
// router.post('/logout', usuarioController.logoutUsuario);

// router.get('/protected', usuarioController.protectedRoute);

module.exports = router
