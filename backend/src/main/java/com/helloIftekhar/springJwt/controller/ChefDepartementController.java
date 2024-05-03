package com.helloIftekhar.springJwt.controller;

import com.helloIftekhar.springJwt.model.User;
import com.helloIftekhar.springJwt.model.Vehicle;
import com.helloIftekhar.springJwt.repository.VehicleRepository;
import com.helloIftekhar.springJwt.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/ChefDepartement")
public class ChefDepartementController {

    @Autowired
    private VehicleRepository vehicleRepository;
    @Autowired
    private UserService userService;
    @GetMapping("/afficherVehculeNondisponibilite")
    public List<Vehicle> traffickerInterconvertibilities() {
        return vehicleRepository.findByDisponibiliteFalse();
    }
    @GetMapping("/getConducteurs")
    public List<User> getConducteurs() {
        return userService.getConducteurs();
    }
}
