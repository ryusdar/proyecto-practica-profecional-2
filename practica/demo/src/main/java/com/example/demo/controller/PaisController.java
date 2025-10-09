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

    @GetMapping
    public List<Pais> getPaises() {
        return paisDao.findAll();
    }

    @PostMapping
    public Pais registrar(@RequestBody Pais pais) {
        return paisDao.save(pais);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        paisDao.deleteById(id);
    }
}
