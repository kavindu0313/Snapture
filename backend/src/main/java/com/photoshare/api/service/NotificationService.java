package com.photoshare.api.service;

import com.photoshare.api.model.Notification;
import com.photoshare.api.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public List<Notification> getNotificationsByUserId(String userId) {
        return notificationRepository.findByUserId(userId);
    }

    public List<Notification> getUnreadNotifications(String userId) {
        return notificationRepository.findByUserIdAndReadFalse(userId);
    }

    public long getUnreadNotificationCount(String userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    public Notification createNotification(Notification notification) {
        notification.setCreatedAt(new Date());
        notification.setRead(false);
        Notification savedNotification = notificationRepository.save(notification);
        
        // Send real-time notification via WebSocket
        messagingTemplate.convertAndSendToUser(
            notification.getUserId(),
            "/queue/notifications",
            savedNotification
        );
        
        return savedNotification;
    }

    public boolean markAsRead(String notificationId) {
        Optional<Notification> optionalNotification = notificationRepository.findById(notificationId);
        if (optionalNotification.isPresent()) {
            Notification notification = optionalNotification.get();
            notification.setRead(true);
            notificationRepository.save(notification);
            return true;
        }
        return false;
    }

    public boolean markAllAsRead(String userId) {
        List<Notification> unreadNotifications = notificationRepository.findByUserIdAndReadFalse(userId);
        for (Notification notification : unreadNotifications) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }
        return true;
    }

    public boolean deleteNotification(String id) {
        if (notificationRepository.existsById(id)) {
            notificationRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
