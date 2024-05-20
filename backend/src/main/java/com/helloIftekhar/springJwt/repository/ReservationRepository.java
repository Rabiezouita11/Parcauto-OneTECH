package com.helloIftekhar.springJwt.repository;

import com.helloIftekhar.springJwt.model.Reservation;
import com.helloIftekhar.springJwt.model.User;
import com.helloIftekhar.springJwt.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    Optional<Reservation> findByVehicleAndStartDateAndEndDate(Vehicle vehicle, Date startDate, Date endDate);
    List<Reservation> findByUserIdConnected(Long userIdConnected);
    List<Reservation> findByUserAndStatusIsTrue(User user);

    List<Reservation> findByUser(User user);
    boolean existsByUserAndStatusIsFalse(User user);

}
