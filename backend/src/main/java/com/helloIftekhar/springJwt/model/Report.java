package com.helloIftekhar.springJwt.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long reservationId;
    private String category;
    private String description;
    private String location;
    private String type;
    private Date date;
    private Long userId; // New field
    private boolean deleted; // Renamed field

    public Report() {
        this.reservationId = null;
        this.userId = null;
        this.category = null;
        this.description = null;
        this.location = null;
        this.type = null;
        this.date = null;
        this.deleted = false; // Set default value to false
    }

    public Report(Long reservationId, Long userId, String category, String description, String location, String type, Date date) {
        this.reservationId = reservationId;
        this.userId = userId;
        this.category = category;
        this.description = description;
        this.location = location;
        this.type = type;
        this.date = date;
        this.deleted = false; // Set default value to false
    }
}
