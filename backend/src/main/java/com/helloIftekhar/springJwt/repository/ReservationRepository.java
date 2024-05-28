package com.helloIftekhar.springJwt.repository;

import com.helloIftekhar.springJwt.model.Reservation;
import com.helloIftekhar.springJwt.model.User;
import com.helloIftekhar.springJwt.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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
    @Query("SELECT r FROM Reservation r WHERE r.user = :user AND r.statusReservation = :statusReservation")
    List<Reservation> findByUserAndStatusReservation(@Param("user") User user, @Param("statusReservation") Boolean statusReservation);

    List<Reservation> findByStatusReservationTrue();
    boolean existsByUserAndStatusAndStatusReservation(User user, boolean status, boolean statusReservation);
    Optional<Reservation> findByVehicleAndStartDateAndEndDateAndStatus(Vehicle vehicle, Date startDate, Date endDate, Boolean status);
    List<Reservation> findByStatusTrueAndStatusReservationNull();
    void deleteByUser_Id(Long userId);

}
