package com.helloIftekhar.springJwt.controller;

import com.helloIftekhar.springJwt.model.*;
import com.helloIftekhar.springJwt.repository.NotificationsRepository;
import com.helloIftekhar.springJwt.repository.ReportRepository;
import com.helloIftekhar.springJwt.repository.ReservationRepository;
import com.helloIftekhar.springJwt.service.CarburantService;
import com.helloIftekhar.springJwt.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/conducteur")
public class ConducteurController {
    @Autowired
    private NotificationsRepository notificationRepository;
    @Autowired
    private CarburantService carburantService;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private ReservationRepository reservationRepository; // Assuming you have a repository for Reservation
    @Autowired
    private ReportRepository reportRepository;
    @Autowired
    private UserService userService;
    @GetMapping("/reservations/{userId}")
    public List<Reservation> getReservationsByUserId(@PathVariable Long userId) {
        return reservationRepository.findByUser_IdAndStatus(userId, true);
    }

    @PostMapping("/save")
    public ResponseEntity<Carburant> saveCarburant(@RequestBody Carburant carburant) {
        try {
            // Save the Carburant entity
            Carburant savedCarburant = carburantService.saveCarburant(carburant);

            // Retrieve the user details based on userId
            Optional<User> userOptional = userService.findById(Math.toIntExact(savedCarburant.getUserId()));
            if (!userOptional.isPresent()) {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND); // User not found
            }

            // Prepare notification data

            String message = "Les informations sur le carburant ont été enregistrées par " + userOptional.get().getUsername() +
                    " (ID utilisateur : " + userOptional.get().getId() + ")";
            Map<String, Object> data = new HashMap<>();
            data.put("message", message);
            data.put("userId", savedCarburant.getUserId());
            data.put("chefDepartementPhoto", userOptional.get().getPhotos());

            // Create and save the notification
            Notification userNotification = new Notification();
            userNotification.setUserId(userOptional.get().getId());
            userNotification.setFileName(userOptional.get().getPhotos());
            userNotification.setMessage(message);
            userNotification.setUsername(userOptional.get().getUsername());
            userNotification.setTimestamp(LocalDateTime.now());
            userNotification.setNotAdmin(false);
            notificationRepository.save(userNotification);

            // Send notification through WebSocket
            messagingTemplate.convertAndSend("/topic/notification", data);

            return new ResponseEntity<>(savedCarburant, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/carburants")
    public ResponseEntity<List<Carburant>> getAllCarburants() {
        List<Carburant> carburants = carburantService.getAllCarburants();
        return new ResponseEntity<>(carburants, HttpStatus.OK);
    }
    @PostMapping("/CreateReport")
    public ResponseEntity<Report> createReport(@RequestBody Report report) {
        try {
            Report savedReport = reportRepository.save(report);
            Optional<User> userOptional = userService.findById(Math.toIntExact(savedReport.getUserId()));
            Map<String, Object> data = new HashMap<>();
            data.put("message", "Nouveau rapport créé par " + userOptional.get().getUsername() + " avec l'identifiant : " + savedReport.getId());
            data.put("userId", savedReport.getUserId());
            data.put("chefDepartementPhoto", userOptional.get().getPhotos());



            Notification userNotification = new Notification();
            userNotification.setUserId(userOptional.get().getId());
            userNotification.setFileName(userOptional.get().getPhotos());
            userNotification.setMessage(data.get("message").toString());
            userNotification.setUsername(userOptional.get().getUsername());
            userNotification.setTimestamp(LocalDateTime.now());
            userNotification.setNotAdmin(false);
            notificationRepository.save(userNotification);



            messagingTemplate.convertAndSend("/topic/notification", data);

            return new ResponseEntity<>(savedReport, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/reportsActive")
    public ResponseEntity<List<Report>> reportsActive() {
        List<Report> reports = reportRepository.findAllActiveReports();
        return new ResponseEntity<>(reports, HttpStatus.OK);
    }
    @GetMapping("/reports")
    public ResponseEntity<List<Report>> getallraport() {
        List<Report> reports = reportRepository.findAll();
        return new ResponseEntity<>(reports, HttpStatus.OK);
    }


    // New endpoint to update deleted to true
    @PutMapping("/reports/{id}/delete")
    public ResponseEntity<Report> deleteReport(@PathVariable Long id) {
        Optional<Report> reportData = reportRepository.findById(id);
        if (reportData.isPresent()) {
            Report report = reportData.get();
            report.setDeleted(true); // Use setDeleted instead of setIsDeleted
            Report updatedReport = reportRepository.save(report);
            return new ResponseEntity<>(updatedReport, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}
