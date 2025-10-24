package com.example.demo.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.demo.dao.ProvinciaDao;
import com.example.demo.model.Provincia;

@RestController
@RequestMapping("/provincias")
public class ProvinciaController {

    @Autowired
    private ProvinciaDao provinciaDao;

    //LISTAR PROVINCIAS
    @GetMapping
    public List<Provincia> getProvincias() {
        return provinciaDao.findAll();
    }

    // CARGAR PROVINCIAS
    @PostMapping
    public Provincia registrar(@RequestBody Provincia provincia) {
        return provinciaDao.save(provincia);
    }

    //ELIMINAR PROVINCIAS
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        provinciaDao.deleteById(id);
    }
}
