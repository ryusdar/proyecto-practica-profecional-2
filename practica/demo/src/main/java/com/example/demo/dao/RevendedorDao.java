package com.example.demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Revendedor;



@Repository
public interface RevendedorDao extends JpaRepository<Revendedor, Long>  {

}
