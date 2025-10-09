package com.example.demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.model.Localidad;

@Repository
public interface LocalidadDao extends JpaRepository<Localidad, Long> {}

