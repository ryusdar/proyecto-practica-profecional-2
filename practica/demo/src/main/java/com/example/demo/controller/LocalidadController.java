package com.example.demo.controller;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
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
    public void eliminar(@PathVariable Long id) {
        localidadDao.deleteById(id);
    }
}
