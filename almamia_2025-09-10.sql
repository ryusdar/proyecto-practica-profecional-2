CREATE DATABASE almamia2;
USE almamia2;

CREATE TABLE categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE producto (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    id_categoria INT,
    stock INT,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
);

CREATE TABLE domicilio (
    id_domicilio INT AUTO_INCREMENT PRIMARY KEY,
    calle VARCHAR(50),
    numero INT,
    id_localidad INT,
    id_provincia INT,
    id_pais INT
);

CREATE TABLE revendedor (
    id_revendedor INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    telefono VARCHAR(20),
    id_domicilio INT,
    FOREIGN KEY (id_domicilio) REFERENCES domicilio(id_domicilio)
);

CREATE TABLE pedido (
    nro_pedido INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE,
    id_revendedor INT,
    id_producto INT,
    cantidad_producto INT,
    FOREIGN KEY (id_revendedor) REFERENCES revendedor(id_revendedor),
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
);

CREATE TABLE factura (
    nro_factura INT AUTO_INCREMENT PRIMARY KEY,
    sucursal VARCHAR(50),
    fecha DATE,
    nro_pedido INT,
    FOREIGN KEY (nro_pedido) REFERENCES pedido(nro_pedido)
);

CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50),
    apellido VARCHAR(50),
    contraseña VARCHAR(100),
    email VARCHAR(100),
    telefono VARCHAR(20),
    rol VARCHAR(20),
    fecha_alta DATE,
    activo BOOLEAN
);

CREATE TABLE pais (
    id_pais INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50)
);

CREATE TABLE provincia (
    id_provincia INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50),
    id_pais INT,
    FOREIGN KEY (id_pais) REFERENCES pais(id_pais)
);

CREATE TABLE localidad (
    id_localidad INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50),
    id_provincia INT,
    FOREIGN KEY (id_provincia) REFERENCES provincia(id_provincia)
);
