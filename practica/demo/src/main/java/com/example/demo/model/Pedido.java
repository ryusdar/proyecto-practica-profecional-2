package com.example.demo.model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "pedido")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "nro_pedido")
    private int nroPedido;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "fecha")
    private LocalDate fecha;

    @Column(name = "cantidad_producto")
    private Integer cantidad_producto;

    @Column(name = "id_producto")
    private int idProducto;

    @Column(name = "id_revendedor")
    private int idRevendedor;

    // Constructor con parámetros
    public Pedido(int nroPedido, LocalDate fecha, Integer cantidad_producto, int idProducto, int idRevendedor) {
        this.nroPedido = nroPedido;
        this.fecha = fecha;
        this.cantidad_producto = cantidad_producto;
        this.idProducto = idProducto;
        this.idRevendedor = idRevendedor;
    }

    // Constructor vacío (obligatorio para JPA)
    public Pedido() {
    }

    // Getters y setters
    public int getNroPedido() {
        return nroPedido;
    }

    public void setNroPedido(int nroPedido) {
        this.nroPedido = nroPedido;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

     public Integer getCantidad_producto() {
        return cantidad_producto;
    }

    public void setCantidad_producto(Integer cantidad_producto) {
        this.cantidad_producto = cantidad_producto;
    }

    public int getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(int idProducto) {
        this.idProducto = idProducto;
    }

    public int getIdRevendedor() {
        return idRevendedor;
    }

    public void setIdRevendedor(int idRevendedor) {
        this.idRevendedor = idRevendedor;
    }

    @Override
    public String toString() {
        return "Pedido{" +
                "nroPedido=" + nroPedido +
                ", fecha=" + fecha +
                ", cantidad_productos=" + cantidad_producto +
                ", idProducto=" + idProducto +
                ", idRevendedor=" + idRevendedor +
                '}';
    }

}