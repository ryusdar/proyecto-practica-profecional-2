package com.example.demo.controller;

import com.example.demo.dao.*;
import com.example.demo.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/pedidos")
@CrossOrigin(origins = "*") 
public class PedidoController {

    @Autowired
    private PedidoDao pedidoDao;

    @Autowired
    private DetallePedidoDao detallePedidoDao;

    @Autowired
    private UsuarioDao usuarioDao;

    @Autowired
    private ProductoDao productoDao;

    // CREAR PEDIDO
    @PostMapping("/crear")
    public ResponseEntity<?> crearPedido(@RequestBody Map<String, Object> datos) {
        Long idUsuario = Long.valueOf(datos.get("idUsuario").toString());
        List<Map<String, Object>> items = (List<Map<String, Object>>) datos.get("detalles");

        Usuario usuario = usuarioDao.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Pedido pedido = new Pedido();
        pedido.setFecha(LocalDate.now());
        pedido.setUsuario(usuario);
        pedido = pedidoDao.save(pedido);

        List<DetallePedido> detalles = new ArrayList<>();

        for (Map<String, Object> item : items) {
            Long idProducto = Long.valueOf(item.get("idProducto").toString());
            Integer cantidad = Integer.valueOf(item.get("cantidad").toString());

            Producto producto = productoDao.findById(idProducto)
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            Double precioUnitario = producto.getPrecio();

            // VERIFICACIÓN STOCK
            if (producto.getStock() < cantidad) {
                throw new RuntimeException("Stock insuficiente para el producto: " + producto.getNombre());
            }

            // RESTA STOCK
            producto.setStock(producto.getStock() - cantidad);
            productoDao.save(producto);

            // DETALLE PEDIDO
            DetallePedido detalle = new DetallePedido(pedido, producto, cantidad, precioUnitario);
            detallePedidoDao.save(detalle);

            detalles.add(detalle);
        }

        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("mensaje", "Pedido creado correctamente");
        respuesta.put("nroPedido", pedido.getNroPedido());
        respuesta.put("detalles", detalles);

        return ResponseEntity.ok(respuesta);
    }

    // OBTENER PEDIDOS DE USUARIO
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<?> obtenerPedidosPorUsuario(@PathVariable Long idUsuario) {
        List<Pedido> pedidos = pedidoDao.findByUsuario_IdUsuario(idUsuario);
        if (pedidos.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        return ResponseEntity.ok(pedidos);
    }

    // OBTENER DETALLES DE UN PEDIDO
    @GetMapping("/{nroPedido}/detalles")
    public ResponseEntity<?> obtenerDetallesDePedido(@PathVariable Long nroPedido) {
        Pedido pedido = pedidoDao.findById(nroPedido)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        List<DetallePedido> detalles = pedido.getDetalles();

        Map<String, Object> data = new HashMap<>();
        data.put("pedido", pedido);
        data.put("detalles", detalles);

        return ResponseEntity.ok(data);
    }
}
