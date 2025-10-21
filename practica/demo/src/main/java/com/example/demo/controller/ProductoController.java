package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dao.ProductoDao;
import com.example.demo.model.Producto;

@RestController
@RequestMapping("/api")
public class ProductoController {

    @Autowired
    private ProductoDao productoDao;

    @GetMapping("/productos")
    public List<Producto> getProductos() {
        return productoDao.findAll();
    }

    @PostMapping("/productos")
    public Producto registrar(@RequestBody Producto producto) {
        return productoDao.save(producto);
    }

    @DeleteMapping("/productos/{id}")
    public void eliminar(@PathVariable("id") Long id) {
        productoDao.deleteById(id);
    }
}

