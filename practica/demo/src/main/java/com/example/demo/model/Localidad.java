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
    private int  idLocalidad;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "id_provincia")
    private int  idProvincia;

    public Localidad() {
    }

    public Localidad(int  idLocalidad, int idProvincia, String nombre) {
        this.idLocalidad = idLocalidad;
        this.idProvincia = idProvincia;
        this.nombre = nombre;
    }

    public int  getIdLocalidad() {
        return idLocalidad;
    }

    public void setIdLocalidad(int  idLocalidad) {
        this.idLocalidad = idLocalidad;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public int getIdProvincia() {
        return idProvincia;
    }

    public void setIdProvincia(int idProvincia) {
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