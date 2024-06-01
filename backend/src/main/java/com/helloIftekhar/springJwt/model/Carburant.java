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



    @JoinColumn(name = "reservation_id")
    private Integer reservation_id;

    @Column(name = "kilometrage_debut")
    private Integer kilometrageDebut;

    @Column(name = "kilometrage_fin")
    private Integer kilometrageFin;

    @Column(name = "quantite_carburant_utiliser")
    private Double quantiteCarburantUtiliser;

    @Column(name = "carburant_consome")
    private Double carburantConsome;
    @Column(name = "user_id") // New field
    private Long userId;

    // No-argument constructor
    public Carburant() {
    }

    // Parameterized constructor
    public Carburant(Integer reservation_id, Integer kilometrageDebut, Integer kilometrageFin, Double quantiteCarburantUtiliser, Double carburantConsome, Long userId) {
        this.reservation_id = reservation_id;
        this.kilometrageDebut = kilometrageDebut;
        this.kilometrageFin = kilometrageFin;
        this.quantiteCarburantUtiliser = quantiteCarburantUtiliser;
        this.carburantConsome = carburantConsome;
        this.userId = userId;

    }
}
