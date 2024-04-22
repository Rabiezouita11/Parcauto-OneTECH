package com.helloIftekhar.springJwt.controller;
import com.helloIftekhar.springJwt.model.Role;
import com.helloIftekhar.springJwt.model.User;
import com.helloIftekhar.springJwt.model.Vehicle;
import com.helloIftekhar.springJwt.service.UserDetailsServiceImp;
import com.helloIftekhar.springJwt.service.UserService;
import com.helloIftekhar.springJwt.service.VehicleService;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
public class AdminController {
    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void sendEmail(MimeMessage mimeMessage) {
        mailSender.send(mimeMessage);
    }
    @Autowired
    private UserDetailsServiceImp userDetailsService;
    @Autowired
    private VehicleService vehicleService;
    @Autowired
    private UserService userService;
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
    @PutMapping("/admin/vehicles/{id}") // Use PUT method for updates
    public Vehicle updateVehicle(@PathVariable Long id, @RequestBody Vehicle vehicle) {
        // Ensure that the ID of the vehicle matches the path variable ID
        vehicle.setId(id);
        System.out.println("idididididididi"+id);
        return vehicleService.saveOrUpdateVehicle(vehicle);
    }
    @DeleteMapping("/admin/vehicles/{id}")
    public void deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
    }


    @GetMapping("/admin/users")
    public ResponseEntity<List<User>> getUsersByRoles() {
        try {
            List<User> users = userService.getAllUsers();

            // Filter users with roles "CHEF_DEPARTEMENT" and "CONDUCTEUR"
            List<User> filteredUsers = users.stream()
                    .filter(user -> user.getRole() == Role.CHEF_DEPARTEMENT || user.getRole() == Role.CONDUCTEUR)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(filteredUsers);
        } catch (Exception e) {
            // Log the exception or handle it as needed
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @PutMapping("/admin/users/{id}/status")
    public ResponseEntity<User> updateUserStatus(@PathVariable Integer id, @RequestParam Boolean status) {
        try {
            User user = userService.getUserById(id);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            // Update user status
            user.setStatus(status);
            userService.saveOrUpdateUser(user);

            // Send email notification
            sendEmail(user.getEmail(), status);

            return ResponseEntity.ok(user);
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @Async
    public void sendEmail(String userEmail, Boolean status) {
        try {
            MimeMessage mail = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mail, true, "UTF-8");

            helper.setFrom("Parcauto-OneTECH");
            helper.setTo(userEmail);
            helper.setSubject("Account Status Update");

            String content;
            if (status) {
                content = "<html><body>"
                        + "<h2 style='color: green;'>Votre compte a été accordé l'accès.</h2>"
                        + "<p>Cliquez <a href='http://localhost:4200/dashboard'>ici</a> pour accéder à votre compte.</p>"
                        + "</body></html>";
            } else {
                content = "<html><body>"
                        + "<h2 style='color: red;'>L'accès à votre compte a été refusé.</h2>"
                        + "</body></html>";
            }

            helper.setText(content, true);
            mailSender.send(mail);
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception
        }
    }


}
