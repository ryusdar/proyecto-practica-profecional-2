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
    public void eliminar(@PathVariable int id) {
        provinciaDao.deleteById(id);
    }
}
