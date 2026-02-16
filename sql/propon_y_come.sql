-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: db
-- Tiempo de generación: 16-02-2026 a las 16:55:53
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
  `id_familia` int NOT NULL,
  `nombre_familia` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `INGREDIENTE`
--

CREATE TABLE `INGREDIENTE` (
  `id_ingrediente` int NOT NULL,
  `nombre_ingrediente` varchar(150) NOT NULL,
  `unidad_medida` varchar(50) DEFAULT 'unidades'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `LISTA_COMPRA`
--

CREATE TABLE `LISTA_COMPRA` (
  `id_lista` int NOT NULL,
  `id_familia` int NOT NULL,
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
  `id_familia` int NOT NULL,
  `id_usuario_propone` int NOT NULL,
  `id_receta` int DEFAULT NULL,
  `titulo_temporal` varchar(100) DEFAULT NULL,
  `descripcion_temporal` text,
  `estado` enum('PENDIENTE','APROBADO','RECHAZADO') DEFAULT 'PENDIENTE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `RECETA`
--

CREATE TABLE `RECETA` (
  `id_receta` int NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `descripcion` text,
  `dificultad` enum('Fácil','Media','Difícil') NOT NULL DEFAULT 'Media',
  `id_usuario_creador` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `RECETA_INGREDIENTE`
--

CREATE TABLE `RECETA_INGREDIENTE` (
  `id_receta` int NOT NULL,
  `id_ingrediente` int NOT NULL,
  `cantidad` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `USUARIO`
--

CREATE TABLE `USUARIO` (
  `id_usuario` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `USUARIO_FAMILIA`
--

CREATE TABLE `USUARIO_FAMILIA` (
  `id_usuario` int NOT NULL,
  `id_familia` int NOT NULL,
  `es_administrador` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `FAMILIA`
--
ALTER TABLE `FAMILIA`
  ADD PRIMARY KEY (`id_familia`);

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
-- AUTO_INCREMENT de la tabla `FAMILIA`
--
ALTER TABLE `FAMILIA`
  MODIFY `id_familia` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `INGREDIENTE`
--
ALTER TABLE `INGREDIENTE`
  MODIFY `id_ingrediente` int NOT NULL AUTO_INCREMENT;

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
  MODIFY `id_planning` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `RECETA`
--
ALTER TABLE `RECETA`
  MODIFY `id_receta` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `USUARIO`
--
ALTER TABLE `USUARIO`
  MODIFY `id_usuario` int NOT NULL AUTO_INCREMENT;

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
