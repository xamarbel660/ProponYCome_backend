-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: db
-- Tiempo de generación: 28-04-2026 a las 17:56:12
-- Versión del servidor: 8.0.43
-- Versión de PHP: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `propon_y_come`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `FAMILIA`
--

CREATE TABLE `FAMILIA` (
  `id_familia` char(36) NOT NULL,
  `nombre_familia` varchar(100) NOT NULL,
  `codigo_invitacion` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `FAMILIA`
--

INSERT INTO `FAMILIA` (`id_familia`, `nombre_familia`, `codigo_invitacion`) VALUES
('7f8b6a3e-99dc-4f82-b099-1abba1682b09', 'FamiliaMartin', 'ADLT2D'),
('e62c1cca-747c-4cb1-9826-de44b1585720', 'FamiliaDeCordoba', 'M4XVS9');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `INGREDIENTE`
--

CREATE TABLE `INGREDIENTE` (
  `id_ingrediente` int NOT NULL,
  `nombre_ingrediente` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `INGREDIENTE`
--

INSERT INTO `INGREDIENTE` (`id_ingrediente`, `nombre_ingrediente`) VALUES
(1, 'Espaguetis'),
(2, 'Bacon'),
(3, 'Huevos'),
(4, 'Queso Parmesano'),
(5, 'Pechuga de Pollo'),
(6, 'Lechuga Romana'),
(7, 'Salsa César'),
(8, 'Patatas'),
(9, 'Cebolla'),
(10, 'Aceite de oliva virgen extra'),
(11, 'Aceite de girasol'),
(12, 'Sal'),
(13, 'Pimienta negra'),
(14, 'Pimentón dulce'),
(15, 'Orégano'),
(16, 'Perejil'),
(17, 'Hoja de laurel'),
(18, 'Vinagre'),
(19, 'Salsa de soja'),
(20, 'Mayonesa'),
(21, 'Ajo'),
(22, 'Pimiento rojo'),
(23, 'Pimiento verde'),
(24, 'Tomate frito'),
(25, 'Tomate triturado'),
(26, 'Tomate cherry'),
(27, 'Zanahoria'),
(28, 'Calabacín'),
(29, 'Berenjena'),
(30, 'Puerro'),
(31, 'Champiñones'),
(32, 'Espinacas'),
(33, 'Brócoli'),
(34, 'Carne picada de ternera'),
(35, 'Carne picada de cerdo'),
(36, 'Carne picada mixta'),
(37, 'Cinta de lomo'),
(38, 'Chorizo'),
(39, 'Jamón serrano'),
(40, 'Jamón cocido'),
(41, 'Salchichas'),
(42, 'Atún en lata'),
(43, 'Salmón fresco'),
(44, 'Lomos de merluza'),
(45, 'Gambas peladas'),
(46, 'Calamares'),
(47, 'Leche entera'),
(48, 'Leche semidesnatada'),
(49, 'Mantequilla'),
(50, 'Queso rallado (mezcla)'),
(51, 'Queso de cabra'),
(52, 'Queso mozzarella'),
(53, 'Nata para cocinar'),
(54, 'Yogur natural'),
(55, 'Arroz redondo'),
(56, 'Arroz basmati'),
(57, 'Macarrones'),
(58, 'Fideos'),
(59, 'Lentejas'),
(60, 'Garbanzos'),
(61, 'Alubias'),
(62, 'Harina de trigo'),
(63, 'Pan rallado'),
(64, 'Pan de molde'),
(65, 'Caldo de pollo'),
(66, 'Caldo de verduras'),
(67, 'Vino blanco'),
(68, 'Azúcar'),
(69, 'Miel'),
(70, 'Ingrediente de prueba'),
(71, 'Borrar'),
(72, 'Borrar2'),
(73, 'Prueba2'),
(74, 'pollo'),
(75, 'arroz'),
(76, 'tomate'),
(77, 'Aceite de oliva'),
(78, 'Romero fresco'),
(79, 'arroz de grano largo'),
(80, 'caldo de carne'),
(90, 'fresa'),
(91, 'zumo de limón'),
(92, 'galletas digestivas'),
(93, 'mantequilla sin sal'),
(94, 'queso crema'),
(95, 'nata para montar'),
(96, 'azúcar glas'),
(97, 'gelatina en polvo sin sabor'),
(98, 'agua'),
(99, 'patata');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `LISTA_COMPRA`
--

CREATE TABLE `LISTA_COMPRA` (
  `id_lista` int NOT NULL,
  `id_familia` char(36) NOT NULL,
  `fecha_generacion` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `LISTA_COMPRA_ITEM`
--

CREATE TABLE `LISTA_COMPRA_ITEM` (
  `id_item` int NOT NULL,
  `id_lista` int NOT NULL,
  `nombre_producto` varchar(150) NOT NULL,
  `cantidad` decimal(10,2) DEFAULT '1.00',
  `unidad` varchar(50) DEFAULT 'uds',
  `comprado` tinyint(1) DEFAULT '0',
  `es_manual` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `PLANNING`
--

CREATE TABLE `PLANNING` (
  `id_planning` int NOT NULL,
  `fecha` date NOT NULL,
  `turno_comida` enum('DESAYUNO','ALMUERZO','MERIENDA','CENA') NOT NULL,
  `id_familia` char(36) NOT NULL,
  `id_usuario_propone` char(36) NOT NULL,
  `id_receta` int DEFAULT NULL,
  `estado` enum('PENDIENTE','APROBADO','RECHAZADO') DEFAULT 'PENDIENTE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `PLANNING`
--

INSERT INTO `PLANNING` (`id_planning`, `fecha`, `turno_comida`, `id_familia`, `id_usuario_propone`, `id_receta`, `estado`) VALUES
(20, '2026-04-22', 'DESAYUNO', '7f8b6a3e-99dc-4f82-b099-1abba1682b09', '33ee8808-00c9-48fb-a498-89e96113ec24', 3, 'APROBADO'),
(21, '2026-04-22', 'MERIENDA', '7f8b6a3e-99dc-4f82-b099-1abba1682b09', '100d093b-e43b-4c80-8d95-a0afaccf9e1b', 34, 'PENDIENTE'),
(22, '2026-04-27', 'DESAYUNO', '7f8b6a3e-99dc-4f82-b099-1abba1682b09', '33ee8808-00c9-48fb-a498-89e96113ec24', 3, 'APROBADO'),
(23, '2026-04-28', 'ALMUERZO', '7f8b6a3e-99dc-4f82-b099-1abba1682b09', '33ee8808-00c9-48fb-a498-89e96113ec24', 1, 'APROBADO'),
(24, '2026-04-29', 'MERIENDA', '7f8b6a3e-99dc-4f82-b099-1abba1682b09', '33ee8808-00c9-48fb-a498-89e96113ec24', 29, 'APROBADO'),
(25, '2026-04-30', 'CENA', '7f8b6a3e-99dc-4f82-b099-1abba1682b09', '33ee8808-00c9-48fb-a498-89e96113ec24', 2, 'APROBADO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `RECETA`
--

CREATE TABLE `RECETA` (
  `id_receta` int NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `descripcion` text,
  `dificultad` enum('Fácil','Media','Difícil') NOT NULL DEFAULT 'Media',
  `id_usuario_creador` char(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `RECETA`
--

INSERT INTO `RECETA` (`id_receta`, `titulo`, `descripcion`, `dificultad`, `id_usuario_creador`) VALUES
(1, 'Espaguetis a la Carbonara', 'Hervir la pasta al dente. Sofreír el bacon. Mezclar yemas con queso y pimienta. Unir todo fuera del fuego.', 'Media', '33ee8808-00c9-48fb-a498-89e96113ec24'),
(2, 'Ensalada César', 'Lavar lechuga. Asar el pollo en tiras. Mezclar con la salsa, los picatostes y el queso.', 'Fácil', '33ee8808-00c9-48fb-a498-89e96113ec24'),
(3, 'Tortilla de Patatas', 'Pochar patata y cebolla en aceite. Batir huevos. Mezclar y cuajar en la sartén.', 'Difícil', '33ee8808-00c9-48fb-a498-89e96113ec24'),
(27, 'Arroz con Pollo y Tomate Sencillo', 'Cocina el pollo troceado hasta dorar. Añade el arroz y sofríe ligeramente. Incorpora tomate picado y agua o caldo. Cocina a fuego lento hasta que el arroz esté tierno y el líquido se haya absorbido. Ajusta de sal y pimienta.', 'Fácil', '33ee8808-00c9-48fb-a498-89e96113ec24'),
(28, 'Pollo Asado con Patatas y Tomate', 'Jugoso pollo asado al horno con patatas tiernas y tomates cherry, aderezado con hierbas aromáticas y un toque de aceite de oliva.', 'Fácil', '33ee8808-00c9-48fb-a498-89e96113ec24'),
(29, 'Arroz con Carne Picada y Cebolla', 'Un plato clásico y reconfortante. Se cocina la carne picada con cebolla hasta dorar, se mezcla con arroz y se termina de cocer para que los sabores se integren.', 'Fácil', '33ee8808-00c9-48fb-a498-89e96113ec24'),
(33, 'Mermelada Artesanal de Fresa', 'Prepara tu propia mermelada de fresa casera con pocos ingredientes. Perfecta para untar en tostadas, acompañar yogur o como relleno de postres. Lava, quita el tallo y corta las fresas. Ponlas en una olla con azúcar y zumo de limón. Cocina a fuego medio-bajo, removiendo ocasionalmente, hasta que espese y alcance el punto de mermelada (aproximadamente 30-45 minutos). Vierte en frascos esterilizados.', 'Media', '100d093b-e43b-4c80-8d95-a0afaccf9e1b'),
(34, 'Tarta Fría de Fresa con Base de Galleta', 'Una deliciosa tarta sin horno con una base crujiente de galleta, un cremoso relleno de queso y una capa brillante de fresas frescas. Ideal para postres veraniegos. Tritura las galletas y mezcla con mantequilla derretida para la base. Refrigera. Para el relleno, bate el queso crema con azúcar y nata. Añade gelatina disuelta en agua tibia. Vierte sobre la base y refrigera. Decora con fresas frescas antes de servir.', 'Media', '100d093b-e43b-4c80-8d95-a0afaccf9e1b'),
(35, 'Arroz con Hortalizas Salteadas', 'Un plato equilibrado donde se cocina el arroz y se mezcla con un sofrito de zanahoria y tomate, acompañado de dados de patata frita o cocida.', 'Media', '74f23c07-3f44-40c9-9111-61a985604981');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `RECETA_INGREDIENTE`
--

CREATE TABLE `RECETA_INGREDIENTE` (
  `id_receta` int NOT NULL,
  `id_ingrediente` int NOT NULL,
  `cantidad` decimal(10,2) NOT NULL,
  `unidad` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `RECETA_INGREDIENTE`
--

INSERT INTO `RECETA_INGREDIENTE` (`id_receta`, `id_ingrediente`, `cantidad`, `unidad`) VALUES
(1, 1, 200.00, 'gramos'),
(1, 2, 100.00, 'gramos'),
(1, 3, 3.00, 'unidades'),
(1, 4, 50.00, 'gramos'),
(2, 4, 30.00, 'gramos'),
(2, 5, 150.00, 'gramos'),
(2, 6, 1.00, 'unidades'),
(2, 7, 50.00, 'ml'),
(3, 3, 5.00, 'unidades'),
(3, 8, 500.00, 'gramos'),
(3, 9, 1.00, 'unidad'),
(27, 74, 1.00, 'unidad'),
(27, 75, 1.00, 'unidad'),
(27, 76, 1.00, 'unidad'),
(28, 8, 500.00, 'gramos'),
(28, 12, 1.00, 'pizca'),
(28, 13, 1.00, 'pizca'),
(28, 26, 250.00, 'gramos'),
(28, 74, 1.00, 'pieza entera'),
(28, 77, 3.00, 'cucharadas'),
(28, 78, 1.00, 'rama'),
(29, 9, 1.00, 'unidad'),
(29, 12, 1.00, 'pizca'),
(29, 13, 1.00, 'pizca'),
(29, 34, 400.00, 'g'),
(29, 77, 2.00, 'cucharadas'),
(29, 79, 250.00, 'g'),
(29, 80, 500.00, 'ml'),
(33, 68, 700.00, 'g'),
(33, 90, 1.00, 'kg'),
(33, 91, 30.00, 'ml'),
(34, 90, 500.00, 'g'),
(34, 92, 200.00, 'g'),
(34, 93, 100.00, 'g'),
(34, 94, 400.00, 'g'),
(34, 95, 200.00, 'ml'),
(34, 96, 100.00, 'g'),
(34, 97, 10.00, 'g'),
(34, 98, 50.00, 'ml'),
(35, 27, 2.00, 'unidades'),
(35, 75, 200.00, 'g'),
(35, 76, 1.00, 'unidad'),
(35, 99, 1.00, 'unidad');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `USUARIO`
--

CREATE TABLE `USUARIO` (
  `id_usuario` char(36) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `USUARIO`
--

INSERT INTO `USUARIO` (`id_usuario`, `nombre`, `email`, `password_hash`) VALUES
('06f01e3f-ea74-493c-82f0-c58b8eb332ef', 'papa', 'papa@gmail.com', '$2b$10$kU5QuulcqXHvBn1iJsJ9aenrp/uud1QAlT0wZorkRJQOWQyB4nYTG'),
('100d093b-e43b-4c80-8d95-a0afaccf9e1b', 'Diego', 'diego@gmail.com', '$2b$10$weSsaQvgG9d2bQH3vZi5De2cFVOvjYGFWYhw45hNdI2IEnj3DM2pS'),
('1b3fdfbf-8af0-461d-a551-3f0dc87a647f', 'Victor', 'victor@gmail.com', '$2b$10$2OrMyW4A25/TJ2/I.TB7N.utcdBPFf3eOxLfwn5tFx2q2iRz5/saq'),
('33ee8808-00c9-48fb-a498-89e96113ec24', 'RubenM', 'rubenM@gmail.com', '$2b$10$kuYCA7SPn.OdNmA0Ou8D9eqYN/rRROSp52uk9jWC6pFL49C4wGiEe'),
('40e53a66-fdbf-403d-9f06-d292aeb64137', 'franB', 'franB@gmail.com', '$2b$10$livKeLlzyON8dn9oZysR7OPECdXQVTP655kbGrYaGUA.E08NIeb1O'),
('61adf3cc-449e-4dbb-8a2f-7c3a311da9c7', 'MartaR', 'martaR@gmial.com', '$2b$10$bLipP/ty5FnePXKMxMTt0OMowrz37k3nUgYz6A3VVUKsJCCliD9/.'),
('74f23c07-3f44-40c9-9111-61a985604981', 'AdrianMB', 'adrianmarqbel@gmail.com', '$2b$10$HvIn.WJA4GM4rGjOb2Oa7OiOWp.Sgxzx5EVWDCeJbqaCSqljW7KUS'),
('8e9abe57-2d47-4e4e-94fe-7557da434031', 'mama', 'mama@gmial.com', '$2b$10$eZQ2/ENz4rAY0.txWrSZxucqCH4bmrotwV9vkHqF2aaINClpxKVPC'),
('aa836323-12f8-458d-919d-fef46aae1ce0', 'Pablo', 'pablo@gmail.com', '$2b$10$dtz8eTwriSTEDCY.fuaYr.E4LtRANkcvNhy0PMKvhl4H22a/bTAbG'),
('ad4de535-5293-4e8e-b98d-881fadc4f819', 'Payan', 'payan@gmail.com', '$2b$10$DhedOF4o7EST3BZVxKhdH.fbRjnqJ.YpOxZJ.uoNFgqTzWP6862qa'),
('c76b7d27-dc1e-4e32-9cd2-3421434ff8a5', 'ariadna', 'ariadna@gmail.com', '$2b$10$PuiZeWDTPjdrKgiVfO3KmedtChICsfizvy/Iax9iEoSmy.MAnlK6q'),
('ce567fd0-1487-4226-b3af-5c31a4056c0c', 'abuela', 'abuela@gmail.com', '$2b$10$WUeWC4q60KhQhYxaZMgC6umLduqNi7bunUwHeXJ9Wo4N4Rs9Gsjdm');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `USUARIO_FAMILIA`
--

CREATE TABLE `USUARIO_FAMILIA` (
  `id_usuario` char(36) NOT NULL,
  `id_familia` char(36) NOT NULL,
  `es_administrador` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `USUARIO_FAMILIA`
--

INSERT INTO `USUARIO_FAMILIA` (`id_usuario`, `id_familia`, `es_administrador`) VALUES
('100d093b-e43b-4c80-8d95-a0afaccf9e1b', '7f8b6a3e-99dc-4f82-b099-1abba1682b09', 0),
('100d093b-e43b-4c80-8d95-a0afaccf9e1b', 'e62c1cca-747c-4cb1-9826-de44b1585720', 1),
('33ee8808-00c9-48fb-a498-89e96113ec24', '7f8b6a3e-99dc-4f82-b099-1abba1682b09', 1),
('33ee8808-00c9-48fb-a498-89e96113ec24', 'e62c1cca-747c-4cb1-9826-de44b1585720', 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `FAMILIA`
--
ALTER TABLE `FAMILIA`
  ADD PRIMARY KEY (`id_familia`),
  ADD UNIQUE KEY `codigo_invitacion` (`codigo_invitacion`),
  ADD UNIQUE KEY `UQ_codigo_invitacion` (`codigo_invitacion`);

--
-- Indices de la tabla `INGREDIENTE`
--
ALTER TABLE `INGREDIENTE`
  ADD PRIMARY KEY (`id_ingrediente`);

--
-- Indices de la tabla `LISTA_COMPRA`
--
ALTER TABLE `LISTA_COMPRA`
  ADD PRIMARY KEY (`id_lista`),
  ADD KEY `id_familia` (`id_familia`);

--
-- Indices de la tabla `LISTA_COMPRA_ITEM`
--
ALTER TABLE `LISTA_COMPRA_ITEM`
  ADD PRIMARY KEY (`id_item`),
  ADD KEY `id_lista` (`id_lista`);

--
-- Indices de la tabla `PLANNING`
--
ALTER TABLE `PLANNING`
  ADD PRIMARY KEY (`id_planning`),
  ADD KEY `id_familia` (`id_familia`),
  ADD KEY `id_usuario_propone` (`id_usuario_propone`),
  ADD KEY `id_receta` (`id_receta`);

--
-- Indices de la tabla `RECETA`
--
ALTER TABLE `RECETA`
  ADD PRIMARY KEY (`id_receta`),
  ADD KEY `id_usuario_creador` (`id_usuario_creador`);

--
-- Indices de la tabla `RECETA_INGREDIENTE`
--
ALTER TABLE `RECETA_INGREDIENTE`
  ADD PRIMARY KEY (`id_receta`,`id_ingrediente`),
  ADD KEY `id_ingrediente` (`id_ingrediente`);

--
-- Indices de la tabla `USUARIO`
--
ALTER TABLE `USUARIO`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `USUARIO_FAMILIA`
--
ALTER TABLE `USUARIO_FAMILIA`
  ADD PRIMARY KEY (`id_usuario`,`id_familia`),
  ADD KEY `id_familia` (`id_familia`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `INGREDIENTE`
--
ALTER TABLE `INGREDIENTE`
  MODIFY `id_ingrediente` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100;

--
-- AUTO_INCREMENT de la tabla `LISTA_COMPRA`
--
ALTER TABLE `LISTA_COMPRA`
  MODIFY `id_lista` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `LISTA_COMPRA_ITEM`
--
ALTER TABLE `LISTA_COMPRA_ITEM`
  MODIFY `id_item` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `PLANNING`
--
ALTER TABLE `PLANNING`
  MODIFY `id_planning` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `RECETA`
--
ALTER TABLE `RECETA`
  MODIFY `id_receta` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `LISTA_COMPRA`
--
ALTER TABLE `LISTA_COMPRA`
  ADD CONSTRAINT `LISTA_COMPRA_ibfk_1` FOREIGN KEY (`id_familia`) REFERENCES `FAMILIA` (`id_familia`) ON DELETE CASCADE;

--
-- Filtros para la tabla `LISTA_COMPRA_ITEM`
--
ALTER TABLE `LISTA_COMPRA_ITEM`
  ADD CONSTRAINT `LISTA_COMPRA_ITEM_ibfk_1` FOREIGN KEY (`id_lista`) REFERENCES `LISTA_COMPRA` (`id_lista`) ON DELETE CASCADE;

--
-- Filtros para la tabla `PLANNING`
--
ALTER TABLE `PLANNING`
  ADD CONSTRAINT `PLANNING_ibfk_1` FOREIGN KEY (`id_familia`) REFERENCES `FAMILIA` (`id_familia`) ON DELETE CASCADE,
  ADD CONSTRAINT `PLANNING_ibfk_2` FOREIGN KEY (`id_usuario_propone`) REFERENCES `USUARIO` (`id_usuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `PLANNING_ibfk_3` FOREIGN KEY (`id_receta`) REFERENCES `RECETA` (`id_receta`) ON DELETE SET NULL;

--
-- Filtros para la tabla `RECETA`
--
ALTER TABLE `RECETA`
  ADD CONSTRAINT `RECETA_ibfk_1` FOREIGN KEY (`id_usuario_creador`) REFERENCES `USUARIO` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `RECETA_INGREDIENTE`
--
ALTER TABLE `RECETA_INGREDIENTE`
  ADD CONSTRAINT `RECETA_INGREDIENTE_ibfk_1` FOREIGN KEY (`id_receta`) REFERENCES `RECETA` (`id_receta`) ON DELETE CASCADE,
  ADD CONSTRAINT `RECETA_INGREDIENTE_ibfk_2` FOREIGN KEY (`id_ingrediente`) REFERENCES `INGREDIENTE` (`id_ingrediente`) ON DELETE RESTRICT;

--
-- Filtros para la tabla `USUARIO_FAMILIA`
--
ALTER TABLE `USUARIO_FAMILIA`
  ADD CONSTRAINT `USUARIO_FAMILIA_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `USUARIO` (`id_usuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `USUARIO_FAMILIA_ibfk_2` FOREIGN KEY (`id_familia`) REFERENCES `FAMILIA` (`id_familia`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
