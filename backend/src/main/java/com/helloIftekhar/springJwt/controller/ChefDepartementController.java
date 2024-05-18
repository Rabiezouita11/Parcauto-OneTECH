package com.helloIftekhar.springJwt.controller;

import com.helloIftekhar.springJwt.model.Reservation;
import com.helloIftekhar.springJwt.model.User;
import com.helloIftekhar.springJwt.model.Vehicle;
import com.helloIftekhar.springJwt.repository.ReservationRepository;
import com.helloIftekhar.springJwt.repository.UserRepository;
import com.helloIftekhar.springJwt.repository.VehicleRepository;
import com.helloIftekhar.springJwt.service.EmailService;
import com.helloIftekhar.springJwt.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/ChefDepartement")
public class ChefDepartementController {

    @Autowired
    private VehicleRepository vehicleRepository;
    @Autowired
    private EmailService emailService;
    @Autowired
    private UserService userService;

    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private UserRepository userRepository;
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
    @GetMapping("/reservations")
    public ResponseEntity<List<Reservation>> getAllReservations() {
        List<Reservation> reservations = reservationRepository.findAll();
        return ResponseEntity.ok(reservations);
    }

    @PutMapping("/updateReservationStatus/{id}")
    public ResponseEntity<?> updateReservationStatus(@PathVariable Long id, @RequestBody Boolean status) {
        try {
            Optional<Reservation> reservationOptional = reservationRepository.findById(id);
            if (reservationOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reservation not found");
            }

            Reservation reservation = reservationOptional.get();
            reservation.setStatus(status);
            reservationRepository.save(reservation);

            // Récupérer les informations nécessaires
            User userConnected = userService.getUserById(Math.toIntExact(reservation.getUserIdConnected())); // Méthode pour récupérer l'utilisateur connecté
            String usernameConnectedFirstname = userConnected.getUsername();
            String usernameConnectedlastname = userConnected.getLastName();

            String firstname = reservation.getUser().getFirstName();
            String lastname = reservation.getUser().getLastName();

            String startDate = reservation.getStartDate().toString();
            String endDate = reservation.getEndDate().toString();

            // Générer le contenu du PDF
            byte[] pdfBytes = emailService.generatePDFContent(usernameConnectedFirstname,usernameConnectedlastname, firstname,lastname, startDate, endDate, reservation.getVehicle());

            // Envoyer un email avec la pièce jointe PDF
            emailService.sendEmailWithPDFAttachment(reservation.getUser().getEmail(), "Reservation Status Update",
                    "Your reservation status has been updated.", pdfBytes);

            return ResponseEntity.ok(reservation);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating reservation status: " + e.getMessage());
        }
    }


    @GetMapping("/{userId}")
    public ResponseEntity<Map<String, String>> getUsernameById(@PathVariable Integer userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            Map<String, String> response = new HashMap<>();
            response.put("username", user.getUsername());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("error", "User not found"));
        }
    }


}
