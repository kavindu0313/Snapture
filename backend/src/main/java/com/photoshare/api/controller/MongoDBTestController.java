package com.photoshare.api.controller;

import com.photoshare.api.model.User;
import com.photoshare.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/mongodb-test")
public class MongoDBTestController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/create-test-user")
    public ResponseEntity<?> createTestUser() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Create a test user
            User testUser = new User();
            testUser.setUsername("testuser" + System.currentTimeMillis());
            testUser.setEmail("test" + System.currentTimeMillis() + "@example.com");
            testUser.setPassword("password123");
            testUser.setFullName("Test User");
            testUser.setBio("This is a test user created to verify MongoDB connection");
            testUser.setCreatedAt(new Date());
            testUser.setUpdatedAt(new Date());
            
            // Save the user to MongoDB
            User savedUser = userRepository.save(testUser);
            
            response.put("success", true);
            response.put("message", "Test user created successfully");
            response.put("user", savedUser);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to create test user");
            response.put("error", e.getMessage());
            
            return ResponseEntity.status(500).body(response);
        }
    }
    
    @GetMapping("/count-users")
    public ResponseEntity<?> countUsers() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            long count = userRepository.count();
            
            response.put("success", true);
            response.put("message", "User count retrieved successfully");
            response.put("count", count);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to count users");
            response.put("error", e.getMessage());
            
            return ResponseEntity.status(500).body(response);
        }
    }
}
