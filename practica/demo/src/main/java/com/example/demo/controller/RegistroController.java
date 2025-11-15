package com.example.demo.controller;
import com.example.demo.dao.*;
import com.example.demo.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/registro")
@CrossOrigin(origins = "http://localhost:8080") 
public class RegistroController {

    @Autowired
    private UsuarioDao usuarioDao;

    @Autowired
    private DomicilioDao domicilioDao;

    @Autowired
    private LocalidadDao localidadDao;

    @Autowired
    private ProvinciaDao provinciaDao;

    @Autowired
    private PaisDao paisDao;

    // LISTAR PAISES
    @GetMapping("/paises")
    public List<Map<String, Object>> listarPaises() {
        List<Pais> paises = paisDao.findAll();
        List<Map<String, Object>> respuesta = new ArrayList<>();

        for (Pais p : paises) {
            Map<String, Object> map = new HashMap<>();
            map.put("idPais", p.getIdPais());
            map.put("nombre", p.getNombre());
            respuesta.add(map);
        }

        return respuesta;
    }

    // LISTAR PROVINCIAS
    @GetMapping("/provincias/{idPais}")
    public List<Map<String, Object>> obtenerProvinciasPorPais(@PathVariable Long idPais) {
        System.out.println("🟢 Buscando provincias para país ID: " + idPais);

        List<Provincia> provincias = provinciaDao.findAll();
        List<Map<String, Object>> resultado = new ArrayList<>();

        for (Provincia p : provincias) {
            if (p.getPais() != null && Objects.equals(p.getPais().getIdPais(), idPais)) {
                Map<String, Object> map = new HashMap<>();
                map.put("idProvincia", p.getIdProvincia());
                map.put("nombre", p.getNombre());
                resultado.add(map);
            }
        }

        return resultado;
    }

    // LISTAR LOCALIDADES
    @GetMapping("/localidades/{idProvincia}")
    public List<Map<String, Object>> obtenerLocalidadesPorProvincia(@PathVariable Long idProvincia) {
        System.out.println("🟢 Buscando localidades para provincia ID: " + idProvincia);

        List<Localidad> localidades = localidadDao.findAll();
        List<Map<String, Object>> resultado = new ArrayList<>();

        for (Localidad l : localidades) {
            if (l.getProvincia() != null && Objects.equals(l.getProvincia().getIdProvincia(), idProvincia)) {
                Map<String, Object> map = new HashMap<>();
                map.put("idLocalidad", l.getIdLocalidad());
                map.put("nombre", l.getNombre());
                resultado.add(map);
            }
        }

        return resultado;
    }
}
