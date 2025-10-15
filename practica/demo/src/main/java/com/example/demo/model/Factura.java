package com.example.demo.model;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "factura")
public class Factura {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "nro_factura")
    private Long nroFactura;

    @Column(name = "sucursal")
    private Long sucursal;

    @Column(name = "fecha")
    private LocalDate fecha;

    @Column(name = "nro_pedido")
    private int nroPedido;
   
    public Factura() {
    }

    public Factura(LocalDate fecha, Long nroFactura, int nroPedido, Long sucursal) {
        this.fecha = fecha;
        this.nroFactura = nroFactura;
        this.nroPedido = nroPedido;
        this.sucursal = sucursal;
    }

    public Long getNroFactura() {
        return nroFactura;
    }

    public void setNroFactura(Long nroFactura) {
        this.nroFactura = nroFactura;
    }

    public Long getSucursal() {
        return sucursal;
    }

    public void setSucursal(Long sucursal) {
        this.sucursal = sucursal;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public int getNroPedido() {
        return nroPedido;
    }

    public void setNroPedido(int nroPedido) {
        this.nroPedido = nroPedido;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("Factura{");
        sb.append("nroFactura=").append(nroFactura);
        sb.append(", sucursal=").append(sucursal);
        sb.append(", fecha=").append(fecha);
        sb.append(", nroPedido=").append(nroPedido);
        sb.append('}');
        return sb.toString();
    }



}
