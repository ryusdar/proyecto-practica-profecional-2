package com.example.demo.controller;


    

import com.example.demo.dao.DetallePedidoDao;
import com.example.demo.dao.PedidoDao;
import com.example.demo.dao.ProductoDao;
import com.example.demo.model.DetallePedido;
import com.example.demo.model.Pedido;
import com.example.demo.model.Producto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/detalle-pedido")
public class DetalleController {

    @Autowired
    private DetallePedidoDao detallePedidoDao;

    @Autowired
    private PedidoDao pedidoDao;

    @Autowired
    private ProductoDao productoDao;

    // Obtener detalles de un pedido
    @GetMapping("/pedido/{nroPedido}")
    public ResponseEntity<?> obtenerDetallesDePedido(@PathVariable Long nroPedido) {
        // Busca el pedido por el número de pedido
        Pedido pedido = pedidoDao.findById(nroPedido).orElse(null);

        if (pedido == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Pedido no encontrado");
        }

        // Obtiene los detalles del pedido
        List<DetallePedido> detalles = detallePedidoDao.findByPedido(pedido);

        return ResponseEntity.ok(detalles);
    }

    // Crear un detalle de pedido
    @PostMapping("/crear/{nroPedido}")
    public ResponseEntity<?> crearDetallePedido(@PathVariable Long nroPedido, @RequestBody DetallePedido detallePedido) {
        // Busca el pedido por número de pedido
        Pedido pedido = pedidoDao.findById(nroPedido).orElse(null);

        if (pedido == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Pedido no encontrado");
        }

        // Verifica si el producto existe
        Producto producto = productoDao.findById(detallePedido.getProducto().getIdProducto()).orElse(null);
        if (producto == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Producto no encontrado");
        }

        // Asocia el pedido y producto al detalle
        detallePedido.setPedido(pedido);
        detallePedido.setProducto(producto);

        // Guarda el detalle de pedido
        DetallePedido detalleGuardado = detallePedidoDao.save(detallePedido);

        return ResponseEntity.status(HttpStatus.CREATED).body(detalleGuardado);
    }

    // Eliminar un detalle de pedido
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminarDetallePedido(@PathVariable Long id) {
        // Verifica si el detalle de pedido existe
        if (!detallePedidoDao.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Detalle de pedido no encontrado");
        }

        // Elimina el detalle de pedido
        detallePedidoDao.deleteById(id);

        return ResponseEntity.ok("Detalle de pedido eliminado correctamente");
    }
}


