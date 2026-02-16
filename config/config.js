const { logMensaje } = require('../utils/logger.js')
// Importar libreria para manejo de ficheros de configuración dependiendo de la variable de entorno NODE_ENV
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV || 'development'}`
})

module.exports = {
  port: process.env.PORT || 3000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'test',
    name: process.env.DB_NAME || 'propon_y_come',
    port: process.env.DB_PORT || 3306
  },
  secretKey: process.env.SECRET_KEY || 'default_secret'
}

logMensaje('DBNAME:', process.env.DB_NAME)
logMensaje('DBHOST:', process.env.DB_HOST)
logMensaje('DBUSER:', process.env.DB_USER)
logMensaje('DBPORT:', process.env.DB_PORT)
logMensaje('NODE_ENV:', process.env.NODE_ENV)
