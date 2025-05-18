package com.photoshare.api.controller;

import com.photoshare.api.model.Notification;
import com.photoshare.api.model.User;
import com.photoshare.api.service.NotificationService;
import com.photoshare.api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/notifications")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
// @CrossOrigin(origins = "*", allowCredentials = "true")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        
        Optional<User> optionalUser = userService.getUserByUsername(currentUsername);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            List<Notification> notifications = notificationService.getNotificationsByUserId(user.getId());
            return ResponseEntity.ok(notifications);
        } else {
            return ResponseEntity.ok(List.of());
        }
    }

    // Get unread notifications
    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        
        Optional<User> optionalUser = userService.getUserByUsername(currentUsername);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            List<Notification> notifications = notificationService.getUnreadNotifications(user.getId());
            return ResponseEntity.ok(notifications);
        } else {
            return ResponseEntity.ok(List.of());
        }
    }

    // Get unread notification count
    @GetMapping("/count")
    public ResponseEntity<?> getUnreadNotificationCount() {
        // For testing purposes, return a mock count if authentication is not available
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName().equals("anonymousUser")) {
            Map<String, Object> response = new HashMap<>();
            response.put("count", 0);
            return ResponseEntity.ok(response);
        }
        
        String currentUsername = authentication.getName();
        
        Optional<User> optionalUser = userService.getUserByUsername(currentUsername);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            long count = notificationService.getUnreadNotificationCount(user.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("count", count);
            return ResponseEntity.ok(response);
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("count", 0);
            return ResponseEntity.ok(response);
        }
    }

    // Mark notification as read
    @PostMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        
        boolean marked = notificationService.markAsRead(id);
        if (marked) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Notification marked as read");
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Failed to mark notification as read");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/read-all")
    public ResponseEntity<?> markAllAsRead() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        
        Optional<User> optionalUser = userService.getUserByUsername(currentUsername);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            boolean marked = notificationService.markAllAsRead(user.getId());
            if (marked) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "All notifications marked as read");
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Failed to mark all notifications as read");
                return ResponseEntity.badRequest().body(response);
            }
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "User not found");
            return ResponseEntity.status(404).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable String id) {
        boolean deleted = notificationService.deleteNotification(id);
        if (deleted) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Notification deleted successfully");
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Failed to delete notification");
            return ResponseEntity.badRequest().body(response);
        }
    }
}
