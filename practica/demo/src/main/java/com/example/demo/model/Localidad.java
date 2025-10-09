package com.example.demo.model;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "localidad")
public class Localidad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_localidad")
    private Long idLocalidad;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "id_provincia")
    private Long idProvincia;

    public Localidad() {
    }

    public Localidad(Long idLocalidad, Long idProvincia, String nombre) {
        this.idLocalidad = idLocalidad;
        this.idProvincia = idProvincia;
        this.nombre = nombre;
    }

    public Long getIdLocalidad() {
        return idLocalidad;
    }

    public void setIdLocalidad(Long idLocalidad) {
        this.idLocalidad = idLocalidad;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Long getIdProvincia() {
        return idProvincia;
    }

    public void setIdProvincia(Long idProvincia) {
        this.idProvincia = idProvincia;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("Localidad{");
        sb.append("idLocalidad=").append(idLocalidad);
        sb.append(", nombre=").append(nombre);
        sb.append(", idProvincia=").append(idProvincia);
        sb.append('}');
        return sb.toString();
    }

    



}