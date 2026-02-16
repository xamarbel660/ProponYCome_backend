// ============================================
// IMPORTACIONES
// ============================================
const config = require('./config/config')
require('dotenv').config()
const express = require('express')
const path = require('path')
const cors = require('cors')
const { logMensaje } = require('./utils/logger.js')
const PORT = config.port

// Rutas de la API
const usuarioRoutes = require('./routes/usuarioRoutes.js')

// ============================================
// INICIALIZACIÓN
// ============================================
const app = express()
const port = process.env.PORT || 3000

// ============================================
// MIDDLEWARE - PARSEO
// ============================================
app.use(express.json())

// ============================================
// MIDDLEWARE - CORS - Cualquier origen
// ============================================
app.use(cors())

// ============================================
// MIDDLEWARE - ARCHIVOS ESTÁTICOS
// ============================================
app.use(express.static(path.join(__dirname, 'public')))

// ============================================
// RUTAS - API REST
// ============================================
app.use('/api/usuarios', usuarioRoutes)

// ============================================
// SERVIDOR
// ============================================
// Iniciar el servidor solo si no estamos en modo de prueba
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logMensaje(`Servidor escuchando en el puerto ${PORT}`)
  })
}
// Exportamos la aplicación para poder hacer pruebas
module.exports = app
