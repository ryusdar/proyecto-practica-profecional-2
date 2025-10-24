package com.example.demo.model;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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

    
    @ManyToOne
    @JoinColumn(name = "id_provincia", referencedColumnName = "id_provincia", nullable = false)
    @JsonBackReference 
    private Provincia provincia;

    
    @OneToMany(mappedBy = "localidad", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Domicilio> domicilios;

    public Localidad() {
    }

    public Localidad(Long idLocalidad, String nombre, Provincia provincia) {
        this.idLocalidad = idLocalidad;
        this.nombre = nombre;
        this.provincia = provincia;
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

    public Provincia getProvincia() {
        return provincia;
    }

    public void setProvincia(Provincia provincia) {
        this.provincia = provincia;
    }

    public List<Domicilio> getDomicilios() {
        return domicilios;
    }

    public void setDomicilios(List<Domicilio> domicilios) {
        this.domicilios = domicilios;
    }

    @Override
    public String toString() {
        return "Localidad{" +
                "idLocalidad=" + idLocalidad +
                ", nombre='" + nombre + '\'' +
                ", provincia=" + (provincia != null ? provincia.getIdProvincia() : null) +
                '}';
    }
}
