package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;





@Entity
@Table(name = "devolucion")
public class Devolucion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_devolucion")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "nro_pedido")
    private Pedido pedido;

    @Column(name = "motivo")
    private String motivo;

    @Column(name = "fecha")
    private String fecha;

    @Column(name = "total")
    private Double total;

    public Devolucion() {}

    public Devolucion(Pedido pedido, String motivo, String fecha, Double total) {
        this.pedido = pedido;
        this.motivo = motivo;
        this.fecha = fecha;
        this.total = total;
    }

    // GETTERS & SETTERS

    public Long getId() {
        return id;
    }

    public Pedido getPedido() {
        return pedido;
    }

    public void setPedido(Pedido pedido) {
        this.pedido = pedido;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }
}
