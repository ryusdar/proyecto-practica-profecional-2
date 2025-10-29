package com.example.demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.model.Boleta;

@Repository
public interface BoletaDao extends JpaRepository<Boleta, Long> {
    Boleta findByPedido_NroPedido(Long nroPedido);
}
