package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dao.ProductoDao;
import com.example.demo.model.Producto;

@RestController
@RequestMapping("/productos")
@CrossOrigin(origins = "*") 
public class ProductoController {

    @Autowired
    private ProductoDao productoDao;

    // OBTENER PRODUCTOS
    @GetMapping
    public List<Producto> listarProductos() {
        return productoDao.findAll();
    }

    // OBTENER PRODUCTOS POR ID
    @GetMapping("/{id}")
    public Producto obtenerProducto(@PathVariable Long id) {
        return productoDao.findById(id).orElse(null);
    }

    // AGREGAR PRODUCTOS
    @PostMapping
    public Producto agregarProducto(@RequestBody Producto producto) {
        return productoDao.save(producto);
    }

    // ACTUALIZAR PRODUCTOS
    @PutMapping("/{id}")
    public Producto actualizarProducto(@PathVariable Long id, @RequestBody Producto nuevo) {
        return productoDao.findById(id).map(p -> {
            p.setNombre(nuevo.getNombre());
            p.setPrecio(nuevo.getPrecio());
            p.setStock(nuevo.getStock());
            p.setIdCategoria(nuevo.getIdCategoria());
            return productoDao.save(p);
        }).orElse(null);
    }

    // ELIMINAR PRODUCTOS
    @DeleteMapping("/{id}")
    public void eliminarProducto(@PathVariable Long id) {
        productoDao.deleteById(id);
    }
}
