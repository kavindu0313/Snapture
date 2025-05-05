package com.photoshare.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/db-test")
public class DatabaseTestController {

    @Autowired
    private MongoTemplate mongoTemplate;

    @GetMapping("/status")
    public ResponseEntity<?> checkDatabaseConnection() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Try to get collection names to verify connection
            List<String> collections = mongoTemplate.getCollectionNames()
                .stream()
                .collect(Collectors.toList());
            
            response.put("connected", true);
            response.put("status", "success");
            response.put("message", "Successfully connected to local MongoDB");
            response.put("database", mongoTemplate.getDb().getName());
            response.put("collections", collections);
            response.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("connected", false);
            response.put("status", "error");
            response.put("message", "Failed to connect to local MongoDB");
            response.put("error", e.getMessage());
            response.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.status(500).body(response);
        }
    }
}
