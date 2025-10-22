package com.example.demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.model.Usuario;

@Repository
public interface UsuarioDao extends JpaRepository<Usuario, Long> {
    Usuario findByEmailAndContraseña(String email, String contraseña);

    Usuario findByEmail(String email);
}


