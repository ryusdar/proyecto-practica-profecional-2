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

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerUsuario(@PathVariable Long id) {
    java.util.Optional<Usuario> usuario = usuarioDao.findById(id);
    if (usuario.isPresent()) {
        return ResponseEntity.ok(usuario.get());
    } else {
        return ResponseEntity.notFound().build();
    }
}

    @PostMapping("/registrar")
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
        usuario.setFechaAlta(LocalDate.now());
        usuario.setActivo((byte) 1);
        usuario.setRol(2);

        System.out.println("🟢 Usuario recibido: " + usuario);

        usuarioDao.save(usuario);

        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("mensaje", "Usuario registrado correctamente");
        respuesta.put("usuario", usuario);

        return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);
    }

    @PostMapping("/recuperar")
    public ResponseEntity<?> recuperarContraseña(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String nuevaPass = body.get("nuevaContraseña");

        Usuario usuario = usuarioDao.findByEmail(email);

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
        Usuario usuario = usuarioDao.findByEmailAndContraseña(
                credenciales.getEmail(),
                credenciales.getContraseña()
        );

        if (usuario == null || usuario.getActivo() == 0) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                 .body("Credenciales inválidas o usuario inactivo");
        }

        Map<String, Object> data = new HashMap<>();
        data.put("id_usuario", usuario.getIdUsuario());
        data.put("nombre", usuario.getNombre());
        data.put("apellido", usuario.getApellido());
        data.put("rol", usuario.getRol());

        return ResponseEntity.ok(data);
    }

    @PutMapping("/{id}")
public ResponseEntity<?> actualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuarioActualizado) {
    try {
        java.util.Optional<Usuario> optionalUsuario = usuarioDao.findById(id);
        if (optionalUsuario.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Usuario no encontrado"));
        }

        Usuario usuarioExistente = optionalUsuario.get();

        if (usuarioActualizado.getNombre() != null)
            usuarioExistente.setNombre(usuarioActualizado.getNombre());

        if (usuarioActualizado.getApellido() != null)
            usuarioExistente.setApellido(usuarioActualizado.getApellido());

        if (usuarioActualizado.getEmail() != null)
            usuarioExistente.setEmail(usuarioActualizado.getEmail());

        if (usuarioActualizado.getTelefono() != null)
            usuarioExistente.setTelefono(usuarioActualizado.getTelefono());

        if (usuarioActualizado.getRol() != null)
            usuarioExistente.setRol(usuarioActualizado.getRol());

        if (usuarioActualizado.getActivo() != null)
            usuarioExistente.setActivo(usuarioActualizado.getActivo());

        if (usuarioExistente.getFechaAlta() == null)
            usuarioExistente.setFechaAlta(LocalDate.now());

        if (usuarioExistente.getActivo() == null)
            usuarioExistente.setActivo((byte) 1);

        usuarioDao.save(usuarioExistente);

        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("mensaje", "✅ Usuario actualizado correctamente");
        respuesta.put("usuario", usuarioExistente);

        return ResponseEntity.ok(respuesta);

    } catch (Exception e) {
        e.printStackTrace(); // 🔍 log detallado en consola
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error interno al actualizar el usuario", "detalle", e.getMessage()));
    }
}

}
