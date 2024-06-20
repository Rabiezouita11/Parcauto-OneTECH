package com.helloIftekhar.springJwt.repository;

import com.helloIftekhar.springJwt.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository

public interface NotificationsRepository  extends JpaRepository<Notification, Long> {
    List<Notification> findByUserId(Integer userId);

}
