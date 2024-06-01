package com.helloIftekhar.springJwt.service;

import com.helloIftekhar.springJwt.model.Carburant;
import com.helloIftekhar.springJwt.repository.CarburantRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class CarburantService {

    private final CarburantRepository carburantRepository;

    public CarburantService(CarburantRepository carburantRepository) {
        this.carburantRepository = carburantRepository;
    }

    public Carburant saveCarburant(Carburant carburant) {
        return carburantRepository.save(carburant);
    }

    public List<Carburant> getAllCarburants() {
        return carburantRepository.findAll();
    }
}
