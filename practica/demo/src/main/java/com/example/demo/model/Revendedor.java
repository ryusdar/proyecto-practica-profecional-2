<<<<<<< Updated upstream
package com.example.demo.model;
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


=======
package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "revendedor")
public class Revendedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_revendedor")
    private Long idRevendedor;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "apellido")
    private String apellido;

    @Column(name = "telefono")
    private String telefono;

    @Column(name = "id_domicilio")
    private Long idDomicilio;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", referencedColumnName = "id_usuario")
    @JsonBackReference
    private Usuario usuario;

    // Constructor vacío
    public Revendedor() {}

    // Constructor con parámetros
    public Revendedor(String nombre, String apellido, String telefono,
                      Long idDomicilio, Usuario usuario) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.idDomicilio = idDomicilio;
        this.usuario = usuario;
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

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    @Override
    public String toString() {
        return "Revendedor{" +
                "idRevendedor=" + idRevendedor +
                ", nombre='" + nombre + '\'' +
                ", apellido='" + apellido + '\'' +
                ", telefono='" + telefono + '\'' +
                ", idDomicilio=" + idDomicilio +
                ", usuarioId=" + (usuario != null ? usuario.getIdUsuario() : null) +
                '}';
    }
}
>>>>>>> Stashed changes
