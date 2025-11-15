package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dao.RevendedorDao;
import com.example.demo.dao.UsuarioDao;
import com.example.demo.model.Revendedor;
import com.example.demo.model.Usuario;

import java.util.List;

@RestController
@RequestMapping("/revendedores")
public class RevendedorController {

    @Autowired
    private RevendedorDao revendedorDao;

    @Autowired
    private UsuarioDao usuarioDao;

    // Obtiene todos los revendedores
    @GetMapping
    public List<Revendedor> getRevendedores() {
        return revendedorDao.findAll();
    }

    // Crea un revendedor y lo asocia a un usuario
    @PostMapping("/crear/{idUsuario}")
    public ResponseEntity<?> crearRevendedor(@PathVariable Long idUsuario,@RequestBody Revendedor revendedor) {

        // Busca el usuario por ID
        Usuario usuario = usuarioDao.findById(idUsuario).orElse(null);

        // Si el usuario no existe, devuelve un error 404
        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Usuario no encontrado");
        }

        // Asocia el usuario al revendedor y lo guarda
        revendedor.setUsuario(usuario);
        Revendedor nuevoRevendedor = revendedorDao.save(revendedor);

        // Devuelve el revendedor creado con un estado 201 (CREATED)
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoRevendedor);
    }

    // Obtiene el perfil de revendedor de un usuario específico
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<?> getRevendedorPorUsuario(@PathVariable Long idUsuario) {
        Revendedor revendedor = revendedorDao.findByUsuarioIdUsuario(idUsuario);

        // Si no se encuentra, devuelve 404
        if (revendedor == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Revendedor no encontrado para este usuario");
        }

        return ResponseEntity.ok(revendedor);
    }

    // Elimina un revendedor por su ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarRevendedor(@PathVariable Long id) {
        // Valida si existe antes de borrar (buena práctica)
        if (!revendedorDao.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Revendedor no encontrado con ID: " + id);
        }

        revendedorDao.deleteById(id);
        return ResponseEntity.ok("Revendedor eliminado correctamente");
    }
}
