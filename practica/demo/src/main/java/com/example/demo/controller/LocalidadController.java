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

import com.example.demo.dao.LocalidadDao;
import com.example.demo.model.Localidad;

@RestController
@RequestMapping("/localidades")
public class LocalidadController {

    @Autowired
    private LocalidadDao localidadDao;

    @GetMapping
    public List<Localidad> getLocalidades() {
        return localidadDao.findAll();
    }

    @PostMapping
    public Localidad registrar(@RequestBody Localidad localidad) {
        return localidadDao.save(localidad);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable int id) {
        localidadDao.deleteById(id);
    }
}
