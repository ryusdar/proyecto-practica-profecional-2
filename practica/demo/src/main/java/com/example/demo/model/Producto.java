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
    private Long id_producto;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "precio")
    private Double precio;

    @Column(name = "stock")
    private int stock;
    @Column(name = "id_categoria")
    private int id_categoria;

    public Producto( String nombre, Double precio, Long id_producto, int stock, int id_categoria) {
        this.nombre = nombre;
        this.precio = precio;
        this.id_producto = id_producto;
        this.stock = stock;
        this.id_categoria = id_categoria;
    }

        public int getId_categoria() {
            return id_categoria;
        }

         public void setId_categoria(int id_categoria) {
        this.id_categoria = id_categoria;
        }

    public Producto() {
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

      public Double getPrecio() {
        return precio;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
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
        sb.append(", nombre=").append(nombre);
        sb.append(", id_producto=").append(id_producto);
        sb.append(", stock=").append(stock);
        sb.append(", id_categoria=").append(id_categoria);
        sb.append('}');
        return sb.toString();
    }

    

    

}
