package com.helloIftekhar.springJwt.model;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String marque;
    private String modele;
    private int annee;
    private String numeroSerie;
    private String statut;
    private String localisation;
    private double kilometrage;
    private String historiqueReservation;
    private String type;
    private boolean disponibilite;
    @JsonBackReference
    @OneToMany(mappedBy = "vehicle")
    private List<Reservation> reservations;
    public Vehicle() {
        this.disponibilite = false; // Setting disponibilite to false by default
    }
    // Constructeurs, getters et setters
}
