-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 13-05-2016 a las 17:44:42
-- Versión del servidor: 10.1.10-MariaDB
-- Versión de PHP: 5.6.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `encuestas`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `encuesta`
--

CREATE TABLE `encuesta` (
  `id_encuesta` int(40) NOT NULL,
  `token` varchar(40) NOT NULL,
  `titulo` varchar(40) NOT NULL,
  `pregunta` varchar(40) NOT NULL,
  `visible` tinyint(1) NOT NULL,
  `fecha` date NOT NULL,
  `total_puntua` int(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `encuesta`
--

INSERT INTO `encuesta` (`id_encuesta`, `token`, `titulo`, `pregunta`, `visible`, `fecha`, `total_puntua`) VALUES
(1, '43b19ed9-a9dd-96a9-2159-d3b1653a9529', 'Colores', '¿Cual es su color favorito', 1, '2016-05-13', 0),
(2, '51be5948-236d-1f66-6b93-73cdedaed49f', 'Comida', '¿Cual es tu comida favorita?', 1, '2016-05-13', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `opciones`
--

CREATE TABLE `opciones` (
  `id_opciones` int(40) NOT NULL,
  `descripcion` varchar(40) NOT NULL,
  `total` int(40) NOT NULL,
  `porcentaje` int(40) NOT NULL,
  `id_encuesta` int(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `opciones`
--

INSERT INTO `opciones` (`id_opciones`, `descripcion`, `total`, `porcentaje`, `id_encuesta`) VALUES
(1, 'Azul', 0, 0, 1),
(2, 'Verde', 0, 0, 2);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `encuesta`
--
ALTER TABLE `encuesta`
  ADD PRIMARY KEY (`id_encuesta`);

--
-- Indices de la tabla `opciones`
--
ALTER TABLE `opciones`
  ADD PRIMARY KEY (`id_opciones`),
  ADD UNIQUE KEY `id_encuesta` (`id_encuesta`),
  ADD UNIQUE KEY `id_encuesta_2` (`id_encuesta`),
  ADD UNIQUE KEY `descripcion` (`descripcion`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `opciones`
--
ALTER TABLE `opciones`
  ADD CONSTRAINT `opciones_ibfk_1` FOREIGN KEY (`id_encuesta`) REFERENCES `encuesta` (`id_encuesta`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
