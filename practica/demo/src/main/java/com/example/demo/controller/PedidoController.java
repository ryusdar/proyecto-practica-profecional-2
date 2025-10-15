package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dao.PedidoDao;
import com.example.demo.model.Pedido;

@RestController
@RequestMapping("/api/pedido")
public class PedidoController {

    @Autowired
    private PedidoDao pedidoDao;

    @GetMapping
    public List<Pedido> getpedido() {
        return pedidoDao.findAll();
    }

    @GetMapping("/buscar")
    public List<Pedido> buscar(@RequestParam int nroPedido) {
        return pedidoDao.findByNroPedido(nroPedido);
    }

    @PostMapping
    public void registrar(@RequestBody Pedido pedido) {
        pedidoDao.save(pedido);
    }

    @DeleteMapping("{id}")
    public void eliminar(@PathVariable int id) {
        pedidoDao.deleteById(id);
    }
}
