<<<<<<< Updated upstream
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
    public void eliminar(@PathVariable Long id) {
        revendedorDao.deleteById(id);
    }
}
=======
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

    @GetMapping
    public List<Revendedor> getRevendedores() {
        return revendedorDao.findAll();
    }

    @PostMapping("/crear/{idUsuario}")
    public ResponseEntity<?> crearRevendedor(@PathVariable Long idUsuario,
                                             @RequestBody Revendedor revendedor) {
        Usuario usuario = usuarioDao.findById(idUsuario).orElse(null);

        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Usuario no encontrado");
        }

        revendedor.setUsuario(usuario);
        Revendedor nuevoRevendedor = revendedorDao.save(revendedor);

        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoRevendedor);
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<?> getRevendedorPorUsuario(@PathVariable Long idUsuario) {
        Revendedor revendedor = revendedorDao.findByUsuarioIdUsuario(idUsuario);

        if (revendedor == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Revendedor no encontrado para este usuario");
        }

        return ResponseEntity.ok(revendedor);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarRevendedor(@PathVariable Long id) {
        revendedorDao.deleteById(id);
        return ResponseEntity.ok("Revendedor eliminado");
    }
}
>>>>>>> Stashed changes
