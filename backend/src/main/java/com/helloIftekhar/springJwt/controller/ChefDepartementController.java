package com.helloIftekhar.springJwt.controller;

import com.helloIftekhar.springJwt.model.Reservation;
import com.helloIftekhar.springJwt.model.User;
import com.helloIftekhar.springJwt.model.Vehicle;
import com.helloIftekhar.springJwt.repository.ReservationRepository;
import com.helloIftekhar.springJwt.repository.VehicleRepository;
import com.helloIftekhar.springJwt.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:4200")@RestController
@RequestMapping("/ChefDepartement")
public class ChefDepartementController {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ReservationRepository reservationRepository;

    @GetMapping("/afficherVehculeNondisponibilite")
    public List<Vehicle> getUnavailableVehicles() {
        return vehicleRepository.findByDisponibiliteTrue();
    }

    @GetMapping("/getConducteurs")
    public List<User> getConductors() {
        // Get all conductors from the user repository
        List<User> conductors = userService.getConducteurs();

        // Filter out conductors who have reservations with status null or true
        List<User> filteredConductors = conductors.stream()
                .filter(conductor -> !reservationRepository.existsByUserAndStatusIsNullTrue(conductor))
                .collect(Collectors.toList());

        return filteredConductors;
    }


    @PostMapping("/createReservation")
    public ResponseEntity<?> createReservation(@RequestBody Reservation reservation) {
        try {
            // Check if the start date and end date are the same
            if (reservation.getStartDate().isEqual(reservation.getEndDate())) {
                return ResponseEntity.badRequest().body("Start date and end date cannot be the same");
            }

            // Check if the reservation already exists for the given vehicle and time period
            Optional<Reservation> existingReservation = reservationRepository.findByVehicleAndStartDateAndEndDate(
                    reservation.getVehicle(), reservation.getStartDate(), reservation.getEndDate());
            if (existingReservation.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Reservation already exists for the given time period");
            }

            // Retrieve the vehicle from the database
            Optional<Vehicle> vehicleOptional = vehicleRepository.findById(reservation.getVehicleId());
            if (vehicleOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("Vehicle not found");
            }

            // Set the vehicle for the reservation
            Vehicle vehicle = vehicleOptional.get();
            reservation.setVehicle(vehicle);

            // Check if userId is not null
            if (reservation.getUserId() != null) {
                // Retrieve the user from the database
                Optional<User> userOptional = userService.findById(reservation.getUserId());
                if (userOptional.isEmpty()) {
                    return ResponseEntity.badRequest().body("User not found");
                }
                // Set the user for the reservation
                reservation.setUser(userOptional.get());
            }

            // Save the reservation
            reservationRepository.save(reservation);

            // Update vehicle disponibilite to false
            vehicle.setDisponibilite(false);
            vehicleRepository.save(vehicle);

            return ResponseEntity.ok(reservation);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating reservation: " + e.getMessage());
        }
    }

    @GetMapping("/reservationsByUserIdConnected/{userIdConnected}")
    public List<Reservation> getReservationsByUserIdConnected(@PathVariable Long userIdConnected) {
        return reservationRepository.findByUserIdConnected(userIdConnected);
    }
}
