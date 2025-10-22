package com.example.demo.controller;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
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

   @PostMapping("/registrar")
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
        try {
            usuario.setFecha_alta(LocalDate.now());
            usuario.setActivo((byte) 1);
            usuario.setRol(2);
            usuarioDao.save(usuario);
            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("mensaje", "Usuario registrado correctamente");
            respuesta.put("usuario", usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Error al registrar usuario: " + e.getMessage());
        }
    }

    @PostMapping("/recuperar")
public ResponseEntity<?> recuperarContraseña(@RequestBody Map<String, String> body) {
    String email = body.get("email");
    String nuevaPass = body.get("nuevaContraseña");

    Usuario usuario = usuarioDao.findByEmail(email); // Buscar usuario por email
    if (usuario == null || usuario.getActivo() == 0) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                             .body("Usuario no encontrado o inactivo");
    }

    usuario.setContraseña(nuevaPass);
    usuarioDao.save(usuario);

    return ResponseEntity.ok("Contraseña actualizada correctamente");
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