package com.helloIftekhar.springJwt.controller;

import com.helloIftekhar.springJwt.model.Notification;
import com.helloIftekhar.springJwt.service.NotificationsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:4200") // Add this annotation to allow requests from specific origin

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    @Autowired
    private NotificationsService notificationService;

    @GetMapping
    public List<Notification> getAllNotifications() {
        return notificationService.getAllNotifications();
    }

    @GetMapping("/{userId}")
    public List<Notification> getNotificationsForUser(@PathVariable Integer userId) {
        return notificationService.getNotificationsForUser(userId);
    }
    @DeleteMapping("/{notificationId}")
    public void deleteNotificationById(@PathVariable Long notificationId) {
        notificationService.deleteNotificationById(notificationId);
    }
}
