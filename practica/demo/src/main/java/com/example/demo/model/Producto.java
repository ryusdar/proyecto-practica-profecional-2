package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "producto")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "id_producto")
    private Long id_producto;
    @Column(name = "stock")
    private int stock;

    public Producto(Long id, String nombre, Long id_producto, int stock) {
        this.id = id;
        this.nombre = nombre;
        this.id_producto = id_producto;
        this.stock = stock;
    }

    public Producto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Long getId_producto() {
        return id_producto;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public void setId_producto(Long id_producto) {
        this.id_producto = id_producto;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("Producto{");
        sb.append("id=").append(id);
        sb.append(", nombre=").append(nombre);
        sb.append(", id_producto=").append(id_producto);
        sb.append('}');
        return sb.toString();
    }

}
