package com.example.demo.controller;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.demo.dao.FacturaDao;
import com.example.demo.model.Factura;

@RestController
@RequestMapping("/factura")
public class FacturaController {

    @Autowired
    private FacturaDao facturaDao;

    @GetMapping
    public List<Factura> getfacturas() {
        return facturaDao.findAll();
    }

    @PostMapping
    public Factura registrar(@RequestBody Factura factura) {
        return facturaDao.save(factura);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        facturaDao.deleteById(id);
    }
}
