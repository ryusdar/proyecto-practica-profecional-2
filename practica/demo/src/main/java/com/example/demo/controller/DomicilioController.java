package com.example.demo.controller;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.demo.dao.DomicilioDao;
import com.example.demo.model.Domicilio;

@RestController
@RequestMapping("/domicilio")
public class DomicilioController {

    @Autowired
    private DomicilioDao domicilioDao;

    // OBTENER DOMICILIOS
    @GetMapping
    public List<Domicilio> getdomicilio() {
        return domicilioDao.findAll();
    }

    // CARGAR DOMICILIOS
    @PostMapping
    public Domicilio registrar(@RequestBody Domicilio domicilio) {
        return domicilioDao.save(domicilio);
    }

    // ELIMINAR DOMICILIOS
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        domicilioDao.deleteById(id);
    }
}
