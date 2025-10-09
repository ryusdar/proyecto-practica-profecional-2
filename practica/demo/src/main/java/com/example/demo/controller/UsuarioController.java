package com.example.demo.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.demo.dao.UsuarioDao;
import com.example.demo.model.Usuario;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioDao usuarioDao;

    @GetMapping
    public List<Usuario> getUsuarios() {
        return usuarioDao.findAll();
    }

    @PostMapping
    public Usuario registrar(@RequestBody Usuario usuario) {
        return usuarioDao.save(usuario);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        usuarioDao.deleteById(id);
    }
}