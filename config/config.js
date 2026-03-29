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

// Dentro de contenedor Linux existe /.dockerenv; en local no.
const isRunningInDocker = fs.existsSync('/.dockerenv')
const envDbHost = process.env.DB_HOST
const resolvedDbHost =
  !isRunningInDocker && envDbHost === 'db'
    ? process.env.DB_HOST_LOCAL || '127.0.0.1'
    : envDbHost || (isRunningInDocker ? 'db' : '127.0.0.1')

module.exports = {
  port: process.env.PORT || 3000,
  db: {
    host: resolvedDbHost,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'test',
    name: process.env.DB_NAME || 'propon_y_come',
    port: process.env.DB_PORT || 3306
  },
  secretKey: process.env.JWT_SECRET_KEY || 'change_me_in_production'
}

if (process.env.NODE_ENV !== 'test') {
  logMensaje(`Configuracion cargada desde ${path.basename(envPathToLoad)} (NODE_ENV=${nodeEnv})`)
  if (!isRunningInDocker && envDbHost === 'db') {
    logMensaje(`DB_HOST=db detectado fuera de Docker. Se usa ${resolvedDbHost} automaticamente.`)
  }
}
