package com.example.demo.model;

import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;

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
    private Integer cantidadProducto;

    // ✅ OPCIÓN 1: Relación completa con JPA (RECOMENDADO)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    @Column(name = "id_revendedor")
    private Long idRevendedor;

    // Constructores
    public Pedido() {
    }

    public Pedido(Long nroPedido, LocalDate fecha, Integer cantidadProducto, Producto producto, Long idRevendedor) {
        this.nroPedido = nroPedido;
        this.fecha = fecha;
        this.cantidadProducto = cantidadProducto;
        this.producto = producto;
        this.idRevendedor = idRevendedor;
    }

    // Getters y Setters
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

    public Integer getCantidadProducto() {
        return cantidadProducto;
    }

    public void setCantidadProducto(Integer cantidadProducto) {
        this.cantidadProducto = cantidadProducto;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
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
                ", cantidadProducto=" + cantidadProducto +
                ", producto=" + (producto != null ? producto.getNombre() : "null") +
                ", idRevendedor=" + idRevendedor +
                '}';
    }
}
