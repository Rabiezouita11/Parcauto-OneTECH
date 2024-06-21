package com.helloIftekhar.springJwt.repository;

import com.helloIftekhar.springJwt.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository

public interface NotificationsRepository  extends JpaRepository<Notification, Long> {
    @Query(value = "SELECT * FROM notifications WHERE user_id = ?1 AND is_not_admin = ?2 ORDER BY is_not_admin DESC, timestamp DESC", nativeQuery = true)
    List<Notification> findByUserIdAndIsNotAdminOrderByIsNotAdminDesc(Integer userId, boolean isNotAdmin);
    @Query("SELECT n FROM Notification n WHERE n.isNotAdmin = false ORDER BY n.id DESC")
    List<Notification> findAllByIsNotAdminFalseOrderByIsNotAdminDesc();
}
