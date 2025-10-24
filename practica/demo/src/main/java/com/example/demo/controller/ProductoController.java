package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dao.ProductoDao;
import com.example.demo.model.Producto;

@RestController
public class ProductoController {
    @Autowired
    private ProductoDao productoDao;

    @GetMapping("/api/productos")
    public List<Producto> getProducto() {
        return productoDao.findAll();
    }

    @PostMapping("/api/pedido")
    public void registrar(@RequestBody Producto producto) {
        productoDao.save(producto);
    }

    @DeleteMapping("/api/pedido/{id}")
    public void eliminar(@PathVariable Long id_producto) {
        productoDao.deleteById(id_producto);
    }
}
