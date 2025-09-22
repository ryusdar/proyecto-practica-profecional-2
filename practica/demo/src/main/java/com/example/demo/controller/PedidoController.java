package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dao.PedidoDao;
import com.example.demo.model.Pedido;

@RestController
public class PedidoController {
      @Autowired
    private PedidoDao pedidoDao;

    @GetMapping("api/producto")
    public List<Pedido> getpedido() {
        return pedidoDao.findAll();
    }

    @PostMapping("api/producto")
    public void registrar(@RequestBody Pedido pedido) {
       pedidoDao.save(pedido);
    }

    @DeleteMapping("api/producto/{id}")
    public void eliminar(@PathVariable Long id) {
        pedidoDao.deleteById(id);
    }
}
