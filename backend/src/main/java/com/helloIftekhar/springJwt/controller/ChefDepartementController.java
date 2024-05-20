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

        // Filter out conductors who have reservations with status not null or false
        List<User> filteredConductors = conductors.stream()
                .filter(conductor -> !reservationRepository.existsByUserAndStatusIsNullOrStatusIsFalse(conductor))
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
            if (reservation.getStartDate().isAfter(reservation.getEndDate())) {
                return ResponseEntity.badRequest().body("Start date cannot be after end date");
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
            User userConnected = userService.getUserById(Math.toIntExact(reservation.getUserIdConnected()));
            String usernameConnectedFirstname = userConnected.getUsername();
            String usernameConnectedlastname = userConnected.getLastName();
            String usernameConnectedEmail = userConnected.getEmail();

            String firstname = reservation.getUser().getFirstName();
            String lastname = reservation.getUser().getLastName();
            String destination = reservation.getDistiantion();
            String accompagnateur = reservation.getAccompagnateur();
            String startDate = reservation.getStartDate().toString();
            String endDate = reservation.getEndDate().toString();
            if (status) {
                // Retrieve necessary information
                String emailSubject = "Confirmation de Réservation";
                String emailBody = "Bonjour [Nom du Chef de Département],\n\n"
                        + "Je vous informe que la réservation de véhicule avec conducteur vous avez passée a été acceptée.\n\n"
                        + "Voici les détails de la mission :\n\n"
                        + "Date et Heure de Prise en Destination : [+21670102400]\n"
                        + "Véhicule Assigné: [contact.otbs@onetech-group.com]\n"
                        + "Conducteur Assigné : Conducteur Assignéee\n"
                        + "Le conducteur été informé de cette mission et se prépare à effectuer le service conformément aux instructions fournies.\n\n"
                        + "Si vous avez besoin de plus d'informations ou de modifications, n'hésitez pas à me contacter..\n\n"
                        + "Cordialement,";

                emailBody = emailBody.replace("[Nom du Chef de Département]", usernameConnectedFirstname + " " + usernameConnectedlastname);
                emailBody = emailBody.replace("[+21670102400]", destination);
                emailBody = emailBody.replace("[contact.otbs@onetech-group.com]", reservation.getVehicle().getMarque());
                emailBody = emailBody.replace("Conducteur Assignéee", reservation.getUser().getFirstName() + " "+ reservation.getUser().getLastName());

                // Generate PDF content
                byte[] pdfBytes = emailService.generatePDFContent(usernameConnectedFirstname, usernameConnectedlastname, firstname, lastname, startDate, endDate, reservation.getVehicle(), destination, accompagnateur);

                // Send email with PDF attachment
                emailService.sendEmailWithPDFAttachment(usernameConnectedEmail, emailSubject,
                        emailBody, pdfBytes);






                String emailSubject2 = " Ordre de Mission ";
                String emailBody2 = "Bonjour [Nom du Conducteur],\n\n"
                        + "Nous vous informons que vous avez été assigné à une nouvelle mission . Voici les détails de la mission :\n\n"
                        + "Date et Heure de Prise en Charge :    [Date et heure]       \n\n"
                        + "Véhicule : [+21670102400]\n"
                        + "Veuillez vous assurer que le véhicule est en parfait état et que toutes les préparations nécessaires sont effectuées avant le début de cette mission.\n"
                        + "Merci de confirmer la réception de cet ordre de mission.\n\n"
                        + "Pour toute question ou clarification, n'hésitez pas à me contacter.\n\n\n"
                        + "Cordialement,";

                emailBody2 = emailBody2.replace("[Nom du Conducteur]", reservation.getUser().getFirstName() + " " + reservation.getUser().getLastName());
                emailBody2 = emailBody2.replace("[Date et heure] ", reservation.getStartDate().toString() +" "+reservation.getEndDate().toString());
                emailBody2= emailBody2.replace(" [+21670102400]", reservation.getVehicle().getMarque());
                emailBody2 = emailBody2.replace("Conducteur Assignéee", reservation.getUser().getFirstName() + " "+ reservation.getUser().getLastName());



                // Send email with PDF attachment
                emailService.sendEmailWithPDFAttachment(reservation.getUser().getEmail(), emailSubject2,
                        emailBody2, pdfBytes);

            }else{
                String emailSubject = "Refus de Réservation et Demande de Contact avec l'Administration";
                String emailBody = "Madame, Monsieur,\n\n"
                        + "Je vous écris pour vous informer que votre réservation a malheureusement été refusée.\n\n"
                        + "Pour obtenir de plus amples informations et discuter des raisons de ce refus, nous vous invitons à contacter notre administration. Vous pouvez les joindre par téléphone ou par e-mail aux coordonnées suivantes :\n\n"
                        + "Téléphone : [+21670102400]\n"
                        + "E-mail : [contact.otbs@onetech-group.com]\n\n"
                        + "Nous restons à votre disposition pour toute question ou clarification supplémentaire.\n\n"
                        + "Cordialement,";

                // Send email
                emailService.sendEmail(usernameConnectedEmail, emailSubject, emailBody);
            }
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
