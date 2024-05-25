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
    private String matricule;
    private String modele;
    private int annee;
    private String numeroSerie;
    private double kilometrage;
    private boolean disponibilite;
    @JsonBackReference
    @OneToMany(mappedBy = "vehicle")
    private List<Reservation> reservations;
    public Vehicle() {
        this.disponibilite = true; // Setting disponibilite to false by default
    }
    // Constructeurs, getters et setters

    public boolean isDisponibilite() {
        return disponibilite;
    }
}
