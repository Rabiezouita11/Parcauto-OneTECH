package com.helloIftekhar.springJwt.repository;

import com.helloIftekhar.springJwt.model.Reservation;
import com.helloIftekhar.springJwt.model.User;
import com.helloIftekhar.springJwt.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    Optional<Reservation> findByVehicleAndStartDateAndEndDate(Vehicle vehicle, LocalDateTime startDate, LocalDateTime endDate);
    List<Reservation> findByUserIdConnected(Long userIdConnected);
    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END FROM Reservation r WHERE r.user = :user AND (r.status IS NULL OR r.status = true)")
    boolean existsByUserAndStatusIsNullTrue(User user);
}
