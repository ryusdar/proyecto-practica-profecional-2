package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.dao.BoletaDao;
import com.example.demo.model.Boleta;
import com.example.demo.model.Pedido;
import com.example.demo.model.Usuario;
import com.example.demo.model.DetallePedido;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/boletas")
@CrossOrigin(origins = "*")
public class BoletaController {

    @Autowired
    private BoletaDao boletaDao;

    /**
     * Obtiene todos los datos de una boleta, pedido, usuario y detalles
     * dado un número de pedido para mostrar en el modal.
     */
    @GetMapping("/pedido/{nroPedido}")
    public ResponseEntity<?> getBoletaByNroPedido(@PathVariable Long nroPedido) {

        // Busca la boleta por el número de pedido
        Boleta boleta = boletaDao.findByPedido_NroPedido(nroPedido);

        if (boleta == null) {
            return ResponseEntity.notFound().build();
        }

        // Cargar los datos relacionados
        Pedido pedido = boleta.getPedido();
        Usuario usuario = pedido.getUsuario();
        List<DetallePedido> detalles = pedido.getDetalles();

        // Construir la respuesta
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("boleta", boleta);
        responseData.put("pedido", pedido);
        responseData.put("usuario", usuario);
        responseData.put("detalles", detalles);

        return ResponseEntity.ok(responseData);
    }
}