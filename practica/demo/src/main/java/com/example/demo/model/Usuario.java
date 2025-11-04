package com.example.demo.model;
import java.time.LocalDate;
import jakarta.persistence.*;

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
    private LocalDate fechaAlta; 

    @Column(name = "activo")
    private Byte activo;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_domicilio", referencedColumnName = "id_domicilio")
    private Domicilio domicilio;


    public Usuario() {}


    public Usuario(Byte activo, String apellido, String contraseña, String email,
                   LocalDate fechaAlta, Long idUsuario, String nombre, Integer rol,
                   String telefono, Domicilio domicilio) {
        this.activo = activo;
        this.apellido = apellido;
        this.contraseña = contraseña;
        this.email = email;
        this.fechaAlta = fechaAlta;
        this.idUsuario = idUsuario;
        this.nombre = nombre;
        this.rol = rol;
        this.telefono = telefono;
        this.domicilio = domicilio;
    }


    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }

    public String getContraseña() { return contraseña; }
    public void setContraseña(String contraseña) { this.contraseña = contraseña; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public Integer getRol() { return rol; }
    public void setRol(Integer rol) { this.rol = rol; }

    public LocalDate getFechaAlta() { return fechaAlta; }
    public void setFechaAlta(LocalDate fechaAlta) { this.fechaAlta = fechaAlta; }

    public Byte getActivo() { return activo; }
    public void setActivo(Byte activo) { this.activo = activo; }

    public Domicilio getDomicilio() { return domicilio; }
    public void setDomicilio(Domicilio domicilio) { this.domicilio = domicilio; }

    @Override
    public String toString() {
        return "Usuario{" +
                "idUsuario=" + idUsuario +
                ", nombre='" + nombre + '\'' +
                ", apellido='" + apellido + '\'' +
                ", email='" + email + '\'' +
                ", telefono='" + telefono + '\'' +
                ", rol=" + rol +
                ", fechaAlta=" + fechaAlta +
                ", activo=" + activo +
                ", domicilio=" + (domicilio != null ? domicilio.getIdDomicilio() : null) +
                '}';
    }
}
