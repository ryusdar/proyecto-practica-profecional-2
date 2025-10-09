package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "provincia")
public class Provincia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_provincia")
    private Long idProvincia;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "id_pais")
    private Long idPais;

    public Provincia() {
    }

    public Provincia(Long idPais, Long idProvincia, String nombre) {
        this.idPais = idPais;
        this.idProvincia = idProvincia;
        this.nombre = nombre;
    }

    public Long getIdProvincia() {
        return idProvincia;
    }

    public void setIdProvincia(Long idProvincia) {
        this.idProvincia = idProvincia;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Long getIdPais() {
        return idPais;
    }

    public void setIdPais(Long idPais) {
        this.idPais = idPais;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("Provincia{");
        sb.append("idProvincia=").append(idProvincia);
        sb.append(", nombre=").append(nombre);
        sb.append(", idPais=").append(idPais);
        sb.append('}');
        return sb.toString();
    }



  }