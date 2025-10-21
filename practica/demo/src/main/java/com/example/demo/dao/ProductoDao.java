package com.example.demo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Producto;

@Repository
public interface ProductoDao extends JpaRepository<Producto, Long> {

    List <Producto>findByNroPedido(Long id_producto);

}
