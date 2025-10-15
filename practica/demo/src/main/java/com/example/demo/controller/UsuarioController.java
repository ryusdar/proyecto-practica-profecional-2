package com.example.demo.controller;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.HashMap;
import java.util.Map;
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

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario credenciales) {
    Usuario usuario = usuarioDao.findByEmailAndContraseña(credenciales.getEmail(), credenciales.getContraseña());

    if (usuario == null || usuario.getActivo() == 0) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas o usuario inactivo");
    }

    Map<String, Object> data = new HashMap<>();
    data.put("id_usuario", usuario.getIdUsuario());
    data.put("nombre", usuario.getNombre());
    data.put("apellido", usuario.getApellido());
    data.put("rol", usuario.getRol());

    return ResponseEntity.ok(data);
}
}