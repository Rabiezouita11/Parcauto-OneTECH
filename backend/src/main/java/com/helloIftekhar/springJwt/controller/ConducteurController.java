package com.helloIftekhar.springJwt.controller;

import com.helloIftekhar.springJwt.model.Carburant;
import com.helloIftekhar.springJwt.model.Reservation;
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
    @GetMapping("/reservations/{userId}")
    public List<Reservation> getReservationsByUserId(@PathVariable Long userId) {
        return reservationRepository.findByUser_IdAndStatus(userId, true);
    }

    @PostMapping("/save")
    public ResponseEntity<Carburant> saveCarburant(@RequestBody Carburant carburant) {

        Carburant savedCarburant = carburantService.saveCarburant(carburant);
        return new ResponseEntity<>(savedCarburant, HttpStatus.CREATED);
    }


}
