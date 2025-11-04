package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "boleta")
public class Boleta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_boleta")
    private Long idBoleta;

    @OneToOne
    @JoinColumn(name = "nro_pedido", referencedColumnName = "nro_pedido")
    private Pedido pedido;

    @Column(name = "fecha_emision")
    private LocalDate fechaEmision;

    @Column(name = "subtotal")
    private Double subtotal;

    @Column(name = "iva")
    private Double iva;

    @Column(name = "total")
    private Double total;

    @Column(name = "estado")
    private String estado; // EMITIDA, PAGADA, ANULADA

    // Constructor vacío
    public Boleta() {}

    // Constructor con parámetros
    public Boleta(Pedido pedido, LocalDate fechaEmision, Double subtotal, Double iva, Double total, String estado) {
        this.pedido = pedido;
        this.fechaEmision = fechaEmision;
        this.subtotal = subtotal;
        this.iva = iva;
        this.total = total;
        this.estado = estado;
    }

    // Getters y Setters
    public Long getIdBoleta() { return idBoleta; }
    public void setIdBoleta(Long idBoleta) { this.idBoleta = idBoleta; }

    public Pedido getPedido() { return pedido; }
    public void setPedido(Pedido pedido) { this.pedido = pedido; }

    public LocalDate getFechaEmision() { return fechaEmision; }
    public void setFechaEmision(LocalDate fechaEmision) { this.fechaEmision = fechaEmision; }

    public Double getSubtotal() { return subtotal; }
    public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }

    public Double getIva() { return iva; }
    public void setIva(Double iva) { this.iva = iva; }

    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    @Override
    public String toString() {
        return "Boleta{" +
                "idBoleta=" + idBoleta +
                ", nroPedido=" + (pedido != null ? pedido.getNroPedido() : null) +
                ", fechaEmision=" + fechaEmision +
                ", subtotal=" + subtotal +
                ", iva=" + iva +
                ", total=" + total +
                ", estado='" + estado + '\'' +
                '}';
    }
}
