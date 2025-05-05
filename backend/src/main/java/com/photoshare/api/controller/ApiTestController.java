package com.photoshare.api.controller;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller specifically for testing API connectivity from the frontend
 */
@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ApiTestController {

    @GetMapping("/ping")
    public Map<String, Object> ping() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Backend is running");
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
    
    @GetMapping("/api-status")
    public Map<String, Object> status() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "PhotoShare API is running");
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
    
    /**
     * Test endpoint for checking authentication
     */
    @GetMapping("/auth-test")
    public Map<String, Object> authTest() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "You are authenticated");
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
}
