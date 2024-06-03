package com.helloIftekhar.springJwt.repository;

import com.helloIftekhar.springJwt.model.Carburant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarburantRepository extends JpaRepository<Carburant, Long> {
    void deleteByUserId(Long userId);

}