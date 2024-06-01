package com.helloIftekhar.springJwt.controller;

import com.helloIftekhar.springJwt.model.Carburant;
import com.helloIftekhar.springJwt.model.Report;
import com.helloIftekhar.springJwt.model.Reservation;
import com.helloIftekhar.springJwt.repository.ReportRepository;
import com.helloIftekhar.springJwt.repository.ReservationRepository;
import com.helloIftekhar.springJwt.service.CarburantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/conducteur")
public class ConducteurController {

    @Autowired
    private CarburantService carburantService;

    @Autowired
    private ReservationRepository reservationRepository; // Assuming you have a repository for Reservation
    @Autowired
    private ReportRepository reportRepository;
    @GetMapping("/reservations/{userId}")
    public List<Reservation> getReservationsByUserId(@PathVariable Long userId) {
        return reservationRepository.findByUser_IdAndStatus(userId, true);
    }

    @PostMapping("/save")
    public ResponseEntity<Carburant> saveCarburant(@RequestBody Carburant carburant) {

        Carburant savedCarburant = carburantService.saveCarburant(carburant);
        return new ResponseEntity<>(savedCarburant, HttpStatus.CREATED);
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
            return new ResponseEntity<>(savedReport, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/reports")
    public ResponseEntity<List<Report>> getAllReports() {
        List<Report> reports = reportRepository.findAll();
        return new ResponseEntity<>(reports, HttpStatus.OK);
    }
}
