package com.helloIftekhar.springJwt.controller;
import com.helloIftekhar.springJwt.model.Vehicle;
import com.helloIftekhar.springJwt.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
public class AdminController {

    @Autowired
    private VehicleService vehicleService;

    @GetMapping("/admin/vehicles")
    public List<Vehicle> getAllVehicles() {
        return vehicleService.getAllVehicles();
    }

    @GetMapping("/admin/vehicles/{id}")
    public Optional<Vehicle> getVehicleById(@PathVariable Long id) {
        return vehicleService.getVehicleById(id);
    }

    @PostMapping("/admin/vehicles")
    public Vehicle createOrUpdateVehicle(@RequestBody Vehicle vehicle) {
        return vehicleService.saveOrUpdateVehicle(vehicle);
    }

    @DeleteMapping("/admin/vehicles/{id}")
    public void deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
    }
}
