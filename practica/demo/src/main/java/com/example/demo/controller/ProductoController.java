package com.example.demo.controller;

import com.example.demo.dao.ProductoDao;
import com.example.demo.model.Producto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ProductoController {
    @Autowired
    private ProductoDao productoDao;

    @GetMapping("/api/productos")
    public List<Producto> getProducto() {
        return productoDao.findAll();
    }
}
