package com.helloIftekhar.springJwt.model;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

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
    public Vehicle() {
        this.disponibilite = false; // Setting disponibilite to false by default
    }
    // Constructeurs, getters et setters
}
