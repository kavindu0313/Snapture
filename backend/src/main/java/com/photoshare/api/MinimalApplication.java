package com.photoshare.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.mongo.MongoDataAutoConfiguration;
import org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * This class is disabled to avoid conflicts with PhotoShareApplication
 */
// @SpringBootApplication(exclude = {
//     MongoAutoConfiguration.class,
//     MongoDataAutoConfiguration.class
// })
// @RestController
// @CrossOrigin(origins = "*")
public class MinimalApplication {

    public static void main(String[] args) {
        // Disabled to avoid conflicts
        // SpringApplication.run(MinimalApplication.class, args);
        System.out.println("MinimalApplication is disabled. Please use PhotoShareApplication instead.");
    }

    // @GetMapping("/ping")
    public Map<String, Object> ping() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Backend is running");
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
}
