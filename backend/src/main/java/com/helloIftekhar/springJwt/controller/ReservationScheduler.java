package com.helloIftekhar.springJwt.controller;

import com.helloIftekhar.springJwt.model.Reservation;
import com.helloIftekhar.springJwt.model.Vehicle;
import com.helloIftekhar.springJwt.repository.ReservationRepository;
import com.helloIftekhar.springJwt.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class ReservationScheduler {
    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private VehicleRepository vehicleRepository;


    @Scheduled(cron = "*/5 * * * * *") // Runs every 5 seconds
    public void updateReservationsAndVehicles() {
        LocalDate today = LocalDate.now();
        System.out.println("today"+today);
        List<Reservation> reservations = reservationRepository.findByStatusTrueAndStatusReservationNull();

        for (Reservation reservation : reservations) {

            System.out.println("end date"+reservation.getEndDate());
            System.out.println("reservation.getEndDate().equals(today)"+reservation.getEndDate().equals(today));

            if (reservation.getEndDate().equals(today)) {
                // Update the reservation's statusReservation to true
                reservation.setStatusReservation(true);
                reservationRepository.save(reservation);

                // Update the vehicle's disponibilite to true
                Vehicle vehicle = reservation.getVehicle();
                vehicle.setDisponibilite(true);
                vehicleRepository.save(vehicle);
            }
        }
    }
}
