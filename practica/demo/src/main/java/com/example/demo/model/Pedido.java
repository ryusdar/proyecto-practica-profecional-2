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
    private Long nroPedido;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "fecha")
    private LocalDate fecha;

    @Column(name = "cantidad_producto")
    private Integer cantidad_producto;

    @Column(name = "id_producto")
    private Long idProducto;

    @Column(name = "id_revendedor")
    private Long idRevendedor;

    // Constructor con parámetros
    public Pedido(Long nroPedido, LocalDate fecha, Integer cantidad_producto, Long idProducto, Long idRevendedor) {
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
    public Long getNroPedido() {
        return nroPedido;
    }

    public void setNroPedido(Long nroPedido) {
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

    public Long getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(Long idProducto) {
        this.idProducto = idProducto;
    }

    public Long getIdRevendedor() {
        return idRevendedor;
    }

    public void setIdRevendedor(Long idRevendedor) {
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