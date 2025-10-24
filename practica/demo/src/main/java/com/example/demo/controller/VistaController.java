package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import com.example.demo.dao.PaisDao;

@Controller
public class VistaController {

    @Autowired
    private PaisDao paisDao;

    // FORMULARIO DE REGISTRO
    @GetMapping("/registro")
    public String mostrarFormulario(Model model) {
        model.addAttribute("paises", paisDao.findAll());
        return "registro"; 
    }
}
