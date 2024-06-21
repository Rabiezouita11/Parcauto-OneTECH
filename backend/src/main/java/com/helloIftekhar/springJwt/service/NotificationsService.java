package com.helloIftekhar.springJwt.service;

import com.helloIftekhar.springJwt.model.Notification;
import com.helloIftekhar.springJwt.repository.NotificationsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class NotificationsService {
    @Autowired
    private NotificationsRepository notificationRepository;
    public List<Notification> getNotificationsForUser(Integer userId) {
        return notificationRepository.findByUserIdAndIsNotAdmin(userId, true);
    }

    public Notification saveNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findByIsNotAdminFalse();
    }
}
