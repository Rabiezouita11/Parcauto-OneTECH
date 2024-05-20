package com.helloIftekhar.springJwt.repository;

import com.helloIftekhar.springJwt.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByDisponibiliteTrue();
    Vehicle findByMatricule(String matricule);

}
