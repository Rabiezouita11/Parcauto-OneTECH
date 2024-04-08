package com.helloIftekhar.springJwt.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/admin")
public class AdminController {


    @GetMapping("/dashboard")
    public String dashboard() {
        // Logic for dashboard endpoint
        return "Admin Dashboard";
    }
}
