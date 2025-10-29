package com.example.demo.model;

import java.time.LocalDate;

<<<<<<< Updated upstream
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
=======
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
>>>>>>> Stashed changes

@Entity
@Table(name = "usuario")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long idUsuario;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "apellido")
    private String apellido;

    @Column(name = "contraseña")
    private String contraseña;

    @Column(name = "email")
    private String email;

    @Column(name = "telefono")
    private String telefono;

    @Column(name = "rol")
    private Integer rol;

    @Column(name = "fecha_alta")
    private LocalDate fecha_alta;

    @Column(name = "activo")
    private Byte activo;

    public Usuario() {
    }

    public Usuario(Byte activo, String apellido, String contraseña, String email, LocalDate fecha_alta, Long idUsuario, String nombre, Integer rol, String telefono) {
        this.activo = activo;
        this.apellido = apellido;
        this.contraseña = contraseña;
        this.email = email;
        this.fecha_alta = fecha_alta;
        this.idUsuario = idUsuario;
        this.nombre = nombre;
        this.rol = rol;
        this.telefono = telefono;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
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

    public String getContraseña() {
        return contraseña;
    }

    public void setContraseña(String contraseña) {
        this.contraseña = contraseña;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

<<<<<<< Updated upstream
    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public Integer getRol() {
        return rol;
    }

    public void setRol(Integer rol) {
        this.rol = rol;
    }

    public LocalDate getFecha_alta() {
        return fecha_alta;
    }

    public void setFecha_alta(LocalDate fecha_alta) {
        this.fecha_alta = fecha_alta;
    }

    public Byte getActivo() {
        return activo;
    }

    public void setActivo(Byte activo) {
        this.activo = activo;
    }
=======
    public Domicilio getDomicilio() { return domicilio; }
    public void setDomicilio(Domicilio domicilio) { this.domicilio = domicilio; }
    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private Revendedor revendedor;

    // Getter y Setter
    public Revendedor getRevendedor() { return revendedor; }
    public void setRevendedor(Revendedor revendedor) { this.revendedor = revendedor; }
>>>>>>> Stashed changes

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("Usuario{");
        sb.append("idUsuario=").append(idUsuario);
        sb.append(", nombre=").append(nombre);
        sb.append(", apellido=").append(apellido);
        sb.append(", contrase\u00f1a=").append(contraseña);
        sb.append(", email=").append(email);
        sb.append(", telefono=").append(telefono);
        sb.append(", rol=").append(rol);
        sb.append(", fecha_alta=").append(fecha_alta);
        sb.append(", activo=").append(activo);
        sb.append('}');
        return sb.toString();
    }

};