package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dao.RevendedorDao;
import com.example.demo.model.Revendedor;
@RestController
public class RevendedorController {
      @Autowired
    private RevendedorDao revendedorDao;

    @GetMapping("api/revendedor")
    public List<Revendedor> getProducto() {
        return revendedorDao.findAll();
    }

    @PostMapping("api/revendedor")
    public void registrar(@RequestBody Revendedor revendedor) {
        revendedorDao.save(revendedor);
    }

    @DeleteMapping("api/revendedor/{id}")
    public void eliminar(@PathVariable int id) {
        revendedorDao.deleteById(id);
    }
}
