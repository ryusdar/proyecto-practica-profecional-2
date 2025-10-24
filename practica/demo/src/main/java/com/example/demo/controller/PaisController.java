package com.example.demo.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.demo.dao.PaisDao;
import com.example.demo.model.Pais;

@RestController
@RequestMapping("/paises")
public class PaisController {

    @Autowired
    private PaisDao paisDao;

    //OBTENER PAISES
    @GetMapping
    public List<Pais> getPaises() {
        return paisDao.findAll();
    }

    //CARGAR PAISES
    @PostMapping
    public Pais registrar(@RequestBody Pais pais) {
        return paisDao.save(pais);
    }

    //ELIMINAR PAISES
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        paisDao.deleteById(id);
    }
}
