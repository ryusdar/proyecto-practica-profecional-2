package com.example.demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.model.DetallePedido;

@Repository
public interface DetallePedidoDao extends JpaRepository<DetallePedido, Long> {
}
