# ProponYCome Backend

API REST del proyecto ProponYCome desarrollada con Node.js, Express, Sequelize y MySQL. Este backend centraliza la autenticación, la gestión de recetas, ingredientes, familias, planificación, compras e inteligencia artificial.

## Tecnologías

- Node.js
- Express
- MySQL
- Sequelize
- JSON Web Tokens
- Google GenAI
- Docker y Docker Compose

## Requisitos

- Node.js 18 o superior
- MySQL 8
- npm
- Docker y Docker Compose, si se quiere levantar todo con contenedores

## Instalación local

1. Instala dependencias:

```bash
npm install
```

2. Crea un archivo `.env` en la raíz del backend con las variables necesarias.

3. Asegúrate de tener MySQL accesible con la base de datos configurada.

4. Inicia el servidor en desarrollo:

```bash
npm run dev
```

El servidor escucha por defecto en `http://localhost:3000`, salvo que la variable `PORT` indique otro valor.

## Variables de entorno

El backend carga primero `.env.development`, `.env.production` o `.env.test` según `NODE_ENV`. Si no existe, usa `.env`.

Variables más relevantes:

- `PORT`: puerto del servidor Express.
- `DB_HOST`: host de MySQL.
- `DB_HOST_LOCAL`: host alternativo cuando `DB_HOST=db` se usa fuera de Docker.
- `DB_USER`: usuario de base de datos.
- `DB_PASSWORD`: contraseña de base de datos.
- `DB_NAME`: nombre de la base de datos.
- `DB_PORT`: puerto de MySQL.
- `JWT_SECRET_KEY`: clave para firmar los tokens.
- `JWT_EXPIRES_IN`: duración de los tokens.
- `IA_API_TOKEN`: token del proveedor de IA.
- `IA_MODEL`: modelo principal de IA.
- `IA_MODELOS_FALLBACK`: modelos alternativos separados por coma.
- `IA_MAX_REINTENTOS`: número de reintentos para llamadas temporales fallidas.
- `IA_BACKOFF_BASE_MS`: base del backoff exponencial.
- `IA_MAX_PETICIONES`: límite local de peticiones a IA.

Ejemplo mínimo de `.env`:

```bash
PORT=3000
DB_HOST=localhost
DB_HOST_LOCAL=127.0.0.1
DB_USER=root
DB_PASSWORD=test
DB_NAME=propon_y_come
DB_PORT=3306
JWT_SECRET_KEY=change_me_in_production
JWT_EXPIRES_IN=7d
IA_API_TOKEN=tu_token
IA_MODEL=gemini-2.5-flash
IA_MODELOS_FALLBACK=gemini-2.0-flash,gemini-2.5-pro
IA_MAX_REINTENTOS=2
IA_BACKOFF_BASE_MS=800
IA_MAX_PETICIONES=0
```

## Ejecución con Docker

El proyecto incluye `docker-compose.yml` con tres servicios:

- MySQL
- phpMyAdmin
- API Node/Express

Para levantar todo:

```bash
docker compose up -d --build
```

Para detenerlo:

```bash
docker compose down
```

Notas importantes:

- Dentro de Docker, el backend usa `DB_HOST=db`.
- Fuera de Docker, si `DB_HOST=db`, la configuración resuelve automáticamente a `127.0.0.1` o a `DB_HOST_LOCAL` si está definido.
- El contenedor del backend necesita recibir las variables de IA si se van a usar los endpoints relacionados con Gemini.

## Scripts disponibles

Según `package.json`:

- `npm run dev`: arranca el servidor con nodemon.
- `npm start`: arranca el servidor en modo normal.
- `npm test`: ejecuta las pruebas con Jest.

## Rutas principales

La API se monta bajo `/api`.

### Usuarios

- `POST /api/usuarios/login`
- `POST /api/usuarios/register`

### Recetas

- `POST /api/recetas`
- `POST /api/recetas/paginadas`
- `POST /api/recetas/new`
- `PUT /api/recetas/update`
- `POST /api/recetas/:id_receta`
- `DELETE /api/recetas/:id_receta`

### Ingredientes

- `POST /api/ingredientes`

### Familias

- `POST /api/familias/paginadas`
- `POST /api/familias`
- `PUT /api/familias/update`
- `POST /api/familias/:id_familia`
- `POST /api/familias/actualizarCodigo/:id_familia`
- `POST /api/familias/entrar/:codigo_invitacion`
- `POST /api/familias/salir/:id_familia`
- `POST /api/familias/rol-admin/:id_familia/:id_usuario_objetivo`
- `DELETE /api/familias/miembro/:id_familia/:id_usuario_objetivo`
- `DELETE /api/familias/:id_familia`

### Planificación

- `POST /api/planning`
- `POST /api/planning/new`
- `PUT /api/planning/estado`

### Compras

- `POST /api/compra/:idFamilia/:fechaLunes`
- `PUT /api/compra/items/:idItem`

### IA

- `POST /api/ia`

## Autenticación

Las rutas protegidas usan JWT en la cabecera `Authorization` con el formato `Bearer <token>`.

## Estructura del proyecto

- `config/`: configuración de entorno y Sequelize.
- `controllers/`: lógica de entrada de cada recurso.
- `middlewares/`: validaciones y protección por token.
- `models/`: modelos Sequelize generados a partir de la base de datos.
- `routes/`: definición de rutas REST.
- `services/`: lógica de negocio.
- `utils/`: utilidades compartidas.
- `public/`: recursos estáticos servidos por Express.

## Observaciones

- El servidor solo arranca si no está en modo test.
- La base de datos se autentica al iniciar Sequelize.
- El proyecto incluye generación de modelos con `sequelize-auto` para reflejar el esquema de la base de datos.

## Documentación auxiliar

- `COMANDOS.MD`: comandos de creación y puesta en marcha del proyecto.
- `request/`: colecciones de peticiones para probar la API.
- `sql/`: scripts SQL del esquema y sus versiones.
