### Creación del proyecto
```
md proyecto
cd proyecto
npm init -y
```

### Libreria para gestionar ficheros ce configuración
```
npm install dotenv 
```

### Instalar nodemon 
```
npm install --save-dev nodemon
```

### Crear un script para desarrollo en package.json
```
 "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  ```

### Crear fichero .env.development con las variables de entorno de desarrollo
### Este es el fichero que se usa con npm run dev
### El fichero .env.production se usa con npm start
```
# Configuración de la base de datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=test
DB_NAME=bar
DB_PORT=3306
# Otras configuraciones
PORT=3000
```

### Instalación y configuración de librerías para manejar la base de datos
```
npm i mysql2 sequelize sequelize-auto
```

// Configurar ./config/sequelize.js y ./config/sequelize-auto.js con parámetros de bbdd
// Utilizar para ello los parámetros definidos en los ficheros de entorno .env

// Probar la conexion
```
node ./config/sequelize.js
```

//Generar los modelos a partir de la estructura de la base de datos (ingeniería inversa)
```
node ./config/sequelize-auto.js
```

### Instalar express, cors
```
npm i express cors
```

### Ejecutar proyecto
```
npm run dev
```

### Instalar librerías para montar un sistema de autentificación basado en JWT
```
npm install jsonwebtoken cookie-parser bcrypt
```
