package com.example.demo.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dao.BoletaDao;
import com.example.demo.dao.DevolucionDao;
import com.example.demo.dao.PedidoDao;
import com.example.demo.model.Boleta;
import com.example.demo.model.Devolucion;
import com.example.demo.model.Pedido;

@RestController
@RequestMapping("/devoluciones")
@CrossOrigin(origins = "*")
public class DevolucionController {

    @Autowired
    private DevolucionDao devolucionDao;

    @Autowired
    private PedidoDao pedidoDao;

    @Autowired
    private BoletaDao boletaDao;

    @PostMapping("/crear")
    public ResponseEntity<?> crearDevolucion(@RequestBody Map<String, Object> data) {

        Long nroPedido = Long.valueOf(data.get("nroPedido").toString());
        String motivo = data.get("motivo").toString();

        // Buscar pedido
        Pedido pedido = pedidoDao.findByNroPedido(nroPedido);

        if (pedido == null) {
            return ResponseEntity.badRequest().body("Pedido no encontrado.");
        }

        // Buscar boleta del pedido
        Boleta boleta = boletaDao.findByPedido_NroPedido(nroPedido);

        if (boleta == null) {
            return ResponseEntity.badRequest().body("No existe boleta para este pedido.");
        }

        // Obtener total real
        Double total = boleta.getTotal();

        // Crear devolución
        Devolucion devolucion = new Devolucion();

        devolucionDao.save(devolucion);

        return ResponseEntity.ok("Devolución registrada correctamente.");
    }
}
