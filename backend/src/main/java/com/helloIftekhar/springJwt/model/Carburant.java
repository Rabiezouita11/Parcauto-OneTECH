package com.helloIftekhar.springJwt.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Carburant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "reservation_id")
    private Reservation reservation;

    @Column(name = "kilometrage_debut")
    private Integer kilometrageDebut;

    @Column(name = "kilometrage_fin")
    private Integer kilometrageFin;

    @Column(name = "quantite_carburant_utiliser")
    private Double quantiteCarburantUtiliser;

    @Column(name = "carburant_consome")
    private Integer carburantConsome;

    // No-argument constructor
    public Carburant() {
    }

    // Parameterized constructor
    public Carburant(Reservation reservation, Integer kilometrageDebut, Integer kilometrageFin, Double quantiteCarburantUtiliser, Integer carburantConsome) {
        this.reservation = reservation;
        this.kilometrageDebut = kilometrageDebut;
        this.kilometrageFin = kilometrageFin;
        this.quantiteCarburantUtiliser = quantiteCarburantUtiliser;
        this.carburantConsome = carburantConsome;
    }
}
