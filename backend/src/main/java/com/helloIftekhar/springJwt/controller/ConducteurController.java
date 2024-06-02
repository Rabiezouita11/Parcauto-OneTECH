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
import java.util.Optional;

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
