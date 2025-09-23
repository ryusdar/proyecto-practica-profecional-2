package com.example.demo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Pedido;


@Repository
public interface PedidoDao extends JpaRepository<Pedido, Long>   {

   List<Pedido> findByNroPedido(Long nroPedido);

   

}
