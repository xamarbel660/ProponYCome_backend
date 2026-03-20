# 1. Usamos una imagen ligera de Node.js
FROM node:20-alpine

# 2. Creamos el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# 3. Copiamos los archivos de dependencias primero (para aprovechar la caché)
COPY package*.json ./

# 4. Instalamos las dependencias
RUN npm ci --omit=dev

# 5. Copiamos el resto del código de nuestra app
COPY . .

# 6. Ejecutar como usuario no root
USER node

# 7. Exponemos el puerto que usa tu app (ej. 3000)
EXPOSE 3000

# 8. Comando para arrancar la aplicación
CMD ["npm", "start"]