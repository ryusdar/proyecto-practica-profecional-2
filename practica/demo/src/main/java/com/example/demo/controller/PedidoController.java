package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dao.PedidoDao;
import com.example.demo.model.Pedido;

@RestController
public class PedidoController {

    @Autowired
    private PedidoDao pedidoDao;

    @GetMapping("/api/pedido")
    public List<Pedido> getpedido() {
        return pedidoDao.findAll();
    }

    @GetMapping("/buscar")
    public List<Pedido> buscar(@RequestParam Long nroPedido) {
        return pedidoDao.findByNroPedido(nroPedido);
    }

    @PostMapping("/api/pedido")
    public void registrar(@RequestBody Pedido pedido) {
        pedidoDao.save(pedido);
    }

    @DeleteMapping("/api/pedido/{id}")
    public void eliminar(@PathVariable Long id) {
        pedidoDao.deleteById(id);
    }
}


