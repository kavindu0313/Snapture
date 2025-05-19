package backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import backend.model.Notification;
import backend.repostry.NotificationRepository;

@RestController
@RequestMapping("/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    // Get all notifications for a user
    @GetMapping("/{userId}")
    public ResponseEntity<List<Notification>> getNotifications(@PathVariable String userId) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return new ResponseEntity<>(notifications, HttpStatus.OK);
    }

    // Get unread notifications for a user
    @GetMapping("/{userId}/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(@PathVariable String userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        return new ResponseEntity<>(notifications, HttpStatus.OK);
    }

    // Get count of unread notifications for a user
    @GetMapping("/{userId}/unread/count")
    public ResponseEntity<Long> getUnreadCount(@PathVariable String userId) {
        long count = notificationRepository.countUnreadByUserId(userId);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    // Mark a notification as read
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + notificationId));
        
        notification.setRead(true);
        Notification updatedNotification = notificationRepository.save(notification);
        return new ResponseEntity<>(updatedNotification, HttpStatus.OK);
    }

    // Mark all notifications as read for a user
    @PutMapping("/{userId}/read-all")
    public ResponseEntity<String> markAllAsRead(@PathVariable String userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        
        for (Notification notification : notifications) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }
        
        return new ResponseEntity<>("All notifications marked as read", HttpStatus.OK);
    }

    // Mark all notifications as viewed for a user
    @PutMapping("/{userId}/view")
    public ResponseEntity<String> markAllAsViewed(@PathVariable String userId) {
        List<Notification> notifications = notificationRepository.findByUserId(userId);
        
        for (Notification notification : notifications) {
            if (!notification.isViewed()) {
                notification.setViewed(true);
                notificationRepository.save(notification);
            }
        }
        
        return new ResponseEntity<>("All notifications marked as viewed", HttpStatus.OK);
    }

    // Create a new notification
    @PostMapping
    public ResponseEntity<Notification> createNotification(@RequestBody Notification notification) {
        Notification savedNotification = notificationRepository.save(notification);
        return new ResponseEntity<>(savedNotification, HttpStatus.CREATED);
    }
    
    // Create a like notification
    @PostMapping("/like")
    public ResponseEntity<Notification> createLikeNotification(@RequestBody NotificationRequest request) {
        Notification notification = new Notification(
            request.getRecipientId(),
            "like",
            request.getTriggeredByUsername() + " liked your " + request.getContentType(),
            request.getContentId(),
            request.getTriggeredById(),
            request.getTriggeredByUsername()
        );
        
        Notification savedNotification = notificationRepository.save(notification);
        return new ResponseEntity<>(savedNotification, HttpStatus.CREATED);
    }
    
    // Create a comment notification
    @PostMapping("/comment")
    public ResponseEntity<Notification> createCommentNotification(@RequestBody NotificationRequest request) {
        Notification notification = new Notification(
            request.getRecipientId(),
            "comment",
            request.getTriggeredByUsername() + " commented on your post: \"" + request.getMessage() + "\"",
            request.getContentId(),
            request.getTriggeredById(),
            request.getTriggeredByUsername()
        );
        
        Notification savedNotification = notificationRepository.save(notification);
        return new ResponseEntity<>(savedNotification, HttpStatus.CREATED);
    }
    
    // Create a follow notification
    @PostMapping("/follow")
    public ResponseEntity<Notification> createFollowNotification(@RequestBody NotificationRequest request) {
        Notification notification = new Notification(
            request.getRecipientId(),
            "follow",
            request.getTriggeredByUsername() + " started following you",
            request.getTriggeredById(), // The related item is the follower's userId
            request.getTriggeredById(),
            request.getTriggeredByUsername()
        );
        
        Notification savedNotification = notificationRepository.save(notification);
        return new ResponseEntity<>(savedNotification, HttpStatus.CREATED);
    }
    
    // Create a community notification
    @PostMapping("/community")
    public ResponseEntity<Notification> createCommunityNotification(@RequestBody NotificationRequest request) {
        Notification notification = new Notification(
            request.getRecipientId(),
            "community",
            request.getTriggeredByUsername() + " added you to the community: " + request.getMessage(),
            request.getContentId(),
            request.getTriggeredById(),
            request.getTriggeredByUsername()
        );
        
        Notification savedNotification = notificationRepository.save(notification);
        return new ResponseEntity<>(savedNotification, HttpStatus.CREATED);
    }
    
    // Helper class for notification requests
    public static class NotificationRequest {
        private String recipientId;
        private String triggeredById;
        private String triggeredByUsername;
        private String contentId;
        private String contentType; // "post", "comment", etc.
        private String message; // For comment content or community name
        
        public String getRecipientId() {
            return recipientId;
        }
        
        public void setRecipientId(String recipientId) {
            this.recipientId = recipientId;
        }
        
        public String getTriggeredById() {
            return triggeredById;
        }
        
        public void setTriggeredById(String triggeredById) {
            this.triggeredById = triggeredById;
        }
        
        public String getTriggeredByUsername() {
            return triggeredByUsername;
        }
        
        public void setTriggeredByUsername(String triggeredByUsername) {
            this.triggeredByUsername = triggeredByUsername;
        }
        
        public String getContentId() {
            return contentId;
        }
        
        public void setContentId(String contentId) {
            this.contentId = contentId;
        }
        
        public String getContentType() {
            return contentType;
        }
        
        public void setContentType(String contentType) {
            this.contentType = contentType;
        }
        
        public String getMessage() {
            return message;
        }
        
        public void setMessage(String message) {
            this.message = message;
        }
    }
}
