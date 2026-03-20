// ============================================
// IMPORTACIONES
// ============================================
const config = require('./config/config')
const express = require('express')
const path = require('path')
const cors = require('cors')
const { logMensaje } = require('./utils/logger.js')
const PORT = config.port

// Rutas de la API
const usuarioRoutes = require('./routes/usuarioRoutes.js')
const recetaRoutes = require('./routes/recetaRoutes.js')
const ingredienteRoutes = require('./routes/ingredienteRoutes.js')
const familiaRoutes = require('./routes/familiaRoutes.js')

// ============================================
// INICIALIZACIÓN
// ============================================
const app = express()

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
app.use('/api/recetas', recetaRoutes)
app.use('/api/ingredientes', ingredienteRoutes)
app.use('/api/familias', familiaRoutes)

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
