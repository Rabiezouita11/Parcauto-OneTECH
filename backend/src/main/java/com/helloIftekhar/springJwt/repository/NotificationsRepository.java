package com.helloIftekhar.springJwt.repository;

import com.helloIftekhar.springJwt.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationsRepository  extends JpaRepository<Notification, Long> {
}
