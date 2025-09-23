package com.example.demo.model;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "revendedores")
public class Revendedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_revendedor")
    private Long idRevendedor;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "apellido")
    private String apellido;

    @Column(name = "id_domicilio")
    private Long idDomicilio;

    @Column(name = "telefono")
    private String telefono;

    public Revendedor() {
    }

    public Revendedor(Long idRevendedor, String nombre, String apellido, Long idDomicilio, String telefono) {
        this.idRevendedor = idRevendedor;
        this.nombre = nombre;
        this.apellido = apellido;
        this.idDomicilio = idDomicilio;
        this.telefono = telefono;
    }

    public Long getIdRevendedor() {
        return idRevendedor;
    }

    public void setIdRevendedor(Long idRevendedor) {
        this.idRevendedor = idRevendedor;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public Long getIdDomicilio() {
        return idDomicilio;
    }

    public void setIdDomicilio(Long idDomicilio) {
        this.idDomicilio = idDomicilio;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("Revendedor{");
        sb.append("idRevendedor=").append(idRevendedor);
        sb.append(", nombre=").append(nombre);
        sb.append(", apellido=").append(apellido);
        sb.append(", idDomicilio=").append(idDomicilio);
        sb.append(", telefono=").append(telefono);
        sb.append('}');
        return sb.toString();
    }
}


