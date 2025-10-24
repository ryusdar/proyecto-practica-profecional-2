package com.example.demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.model.Pedido;
import java.util.List;

@Repository
public interface PedidoDao extends JpaRepository<Pedido, Long> {
    List<Pedido> findByUsuario_IdUsuario(Long idUsuario);
}
