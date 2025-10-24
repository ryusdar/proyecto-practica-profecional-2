package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dao.PedidoDao;
import com.example.demo.dao.ProductoDao;
import com.example.demo.model.Pedido;
import com.example.demo.model.Producto;

@RestController
@RequestMapping("/api")
public class PedidoController {

    @Autowired
    private PedidoDao pedidoDao;

    @Autowired
    private ProductoDao productoDao;

    @GetMapping("/pedido")
    public List<Pedido> getPedido() {
        return pedidoDao.findAll();
    }

    @GetMapping("/pedido/buscar")
    public List<Pedido> buscar(@RequestParam Long nroPedido) {
        return pedidoDao.findByNroPedido(nroPedido);
    }

    @PostMapping("/pedido")
    public ResponseEntity<String> registrar(@RequestBody Pedido pedido) {
        // Validar que el producto exista
        if (pedido.getProducto() != null && pedido.getProducto().getIdProducto() != null) {
            Producto producto = productoDao.findById(pedido.getProducto().getIdProducto())
                    .orElse(null);

            if (producto == null) {
                return ResponseEntity.badRequest().body("Producto no encontrado");
            }

            // Verificar stock disponible
            if (producto.getStock() < pedido.getCantidadProducto()) {
                return ResponseEntity.badRequest().body("Stock insuficiente");
            }

            // Actualizar stock
            producto.setStock(producto.getStock() - pedido.getCantidadProducto());
            productoDao.save(producto);

            pedido.setProducto(producto);
        }

        pedidoDao.save(pedido);
        return ResponseEntity.ok("Pedido registrado correctamente");
    }

    @DeleteMapping("/pedido/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Long id) {
        if (!pedidoDao.existsById(id)) {
            return ResponseEntity.badRequest().body("Pedido no encontrado");
        }
        pedidoDao.deleteById(id);
        return ResponseEntity.ok("Pedido eliminado correctamente");
    }
}
