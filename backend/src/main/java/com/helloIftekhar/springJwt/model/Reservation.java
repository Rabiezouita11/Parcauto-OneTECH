package com.helloIftekhar.springJwt.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "reservation")
@Getter
@Setter
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "mission")
    private String mission;

    public Reservation() {}

    // Constructor with all fields
    public Reservation(User user, Vehicle vehicle, LocalDateTime startDate, LocalDateTime endDate, String mission) {
        this.user = user;
        this.vehicle = vehicle;
        this.startDate = startDate;
        this.endDate = endDate;
        this.mission = mission;
    }

    // Getter method for userId
    public Integer getUserId() {
        return this.user != null ? this.user.getId() : null;
    }

    // Getter method for vehicleId
    public Long getVehicleId() {
        return this.vehicle != null ? this.vehicle.getId() : null;
    }
}
