package com.example.demo.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// DAOs
import com.example.demo.dao.DetallePedidoDao;
import com.example.demo.dao.PedidoDao;
import com.example.demo.dao.ProductoDao;
import com.example.demo.dao.UsuarioDao;
import com.example.demo.dao.BoletaDao; // <-- 1. IMPORTAR DAO DE BOLETA

// Modelos
import com.example.demo.model.DetallePedido;
import com.example.demo.model.Pedido;
import com.example.demo.model.Producto;
import com.example.demo.model.Usuario;
import com.example.demo.model.Boleta;   // <-- 2. IMPORTAR MODELO BOLETA

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

    @Autowired
    private BoletaDao boletaDao; // <-- 3. INYECTAR DAO DE BOLETA

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
        pedido = pedidoDao.save(pedido); // Se guarda el pedido para obtener el ID

        List<DetallePedido> detalles = new ArrayList<>();
        Double totalPedido = 0.0; // <-- 4. VARIABLE PARA ACUMULAR EL TOTAL

        for (Map<String, Object> item : items) {
            Long idProducto = Long.valueOf(item.get("idProducto").toString());
            Integer cantidad = Integer.valueOf(item.get("cantidad").toString());

            Producto producto = productoDao.findById(idProducto)
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            Double precioUnitario = producto.getPrecio();

            // VERIFICACIÓN STOCK
            if (producto.getStock() < cantidad) {
                // Considera usar @Transactional para revertir el pedido si el stock falla
                throw new RuntimeException("Stock insuficiente para el producto: " + producto.getNombre());
            }

            // RESTA STOCK
            producto.setStock(producto.getStock() - cantidad);
            productoDao.save(producto);

            // DETALLE PEDIDO
            DetallePedido detalle = new DetallePedido(pedido, producto, cantidad, precioUnitario);
            detallePedidoDao.save(detalle);

            detalles.add(detalle);

            totalPedido += (precioUnitario * cantidad); // <-- 5. ACUMULAR TOTAL
        }

        // --- 6. CREACIÓN DE LA BOLETA ---
        try {
            // Asumimos un IVA del 19% (0.19). Ajusta esta tasa según tu necesidad.
            final Double IVA_TASA = 0.19;
            Double subtotal = totalPedido / (1 + IVA_TASA);
            Double iva = totalPedido - subtotal;

            Boleta boleta = new Boleta(
                    pedido,             // El pedido recién creado
                    LocalDate.now(),    // Fecha de emisión
                    subtotal,           // Subtotal calculado
                    iva,                // IVA calculado
                    totalPedido,        // Total del pedido
                    "EMITIDA"           // Estado inicial
            );

            boletaDao.save(boleta); // Guardamos la boleta

        } catch (Exception e) {
            // Loggear el error. El pedido se creó, pero la boleta falló.
            System.err.println("Error al crear la boleta para el pedido " + pedido.getNroPedido() + ": " + e.getMessage());
            // No lanzamos excepción para no fallar la creación del pedido
        }
        // --- FIN CREACIÓN BOLETA ---

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
