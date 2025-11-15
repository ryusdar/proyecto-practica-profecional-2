package com.example.demo.model;

// ... (imports) ...
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "revendedor")
public class Revendedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_revendedor")
    private Long idRevendedor;
    // ... (resto de atributos, constructores, getters y setters) ...

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "apellido")
    private String apellido;

    @Column(name = "telefono")
    private String telefono;

    @Column(name = "id_domicilio")
    private Long idDomicilio;

    public Revendedor() {}

    // Constructor con parámetros
    public Revendedor(String nombre, String apellido, String telefono, Long idDomicilio) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.idDomicilio = idDomicilio;
        
    }
    // Getters y Setters
    public Long getIdRevendedor() { return idRevendedor; }
    public void setIdRevendedor(Long idRevendedor) { this.idRevendedor = idRevendedor; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public Long getIdDomicilio() { return idDomicilio; }
    public void setIdDomicilio(Long idDomicilio) { this.idDomicilio = idDomicilio; }



    @Override
    public String toString() {
        return "Revendedor{" +
                "idRevendedor=" + idRevendedor +
                ", nombre='" + nombre + '\'' +
                ", apellido='" + apellido + '\'' +
                ", telefono='" + telefono + '\'' +
                ", idDomicilio=" + idDomicilio +
                '}';
    }
}