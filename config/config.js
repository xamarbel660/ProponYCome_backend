const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')
const { logMensaje } = require('../utils/logger.js')

// Carga un .env especifico por entorno y, si no existe, usa el .env por defecto.
const nodeEnv = process.env.NODE_ENV || 'development'
const envByEnvironmentPath = path.resolve(process.cwd(), `.env.${nodeEnv}`)
const defaultEnvPath = path.resolve(process.cwd(), '.env')
const envPathToLoad = fs.existsSync(envByEnvironmentPath) ? envByEnvironmentPath : defaultEnvPath

dotenv.config({ path: envPathToLoad })

module.exports = {
  port: process.env.PORT || 3000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'test',
    name: process.env.DB_NAME || 'propon_y_come',
    port: process.env.DB_PORT || 3306
  },
  secretKey: process.env.JWT_SECRET_KEY || 'change_me_in_production'
}

if (process.env.NODE_ENV !== 'test') {
  logMensaje(`Configuracion cargada desde ${path.basename(envPathToLoad)} (NODE_ENV=${nodeEnv})`)
}
