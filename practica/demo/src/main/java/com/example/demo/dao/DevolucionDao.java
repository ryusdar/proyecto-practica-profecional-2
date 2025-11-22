package com.example.demo.dao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Devolucion;

@Repository
public interface DevolucionDao extends JpaRepository<Devolucion, Long> {

    Devolucion findByPedido_NroPedido(Long nroPedido);

}