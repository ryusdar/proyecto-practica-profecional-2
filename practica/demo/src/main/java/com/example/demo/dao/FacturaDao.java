package com.example.demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.model.Factura;

@Repository
public interface FacturaDao extends JpaRepository<Factura, Long> {}
