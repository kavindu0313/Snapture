package com.photoshare.api.controller;

import com.photoshare.api.model.User;
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
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        // Remove passwords from response
        users.forEach(user -> user.setPassword(null));
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id) {
        Optional<User> user = userService.getUserById(id);
        if (user.isPresent()) {
            User userData = user.get();
            userData.setPassword(null); // Don't send password back to client
            return ResponseEntity.ok(userData);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "User not found");
            return ResponseEntity.status(404).body(response);
        }
    }

    @GetMapping("/profile/{username}")
    public ResponseEntity<?> getUserByUsername(@PathVariable String username) {
        Optional<User> user = userService.getUserByUsername(username);
        if (user.isPresent()) {
            User userData = user.get();
            userData.setPassword(null); // Don't send password back to client
            return ResponseEntity.ok(userData);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "User not found");
            return ResponseEntity.status(404).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody User userDetails) {
        // Check if the authenticated user is the same as the user being updated
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        
        Optional<User> optionalUser = userService.getUserById(id);
        if (optionalUser.isPresent() && optionalUser.get().getUsername().equals(currentUsername)) {
            User updatedUser = userService.updateUser(id, userDetails);
            if (updatedUser != null) {
                updatedUser.setPassword(null); // Don't send password back to client
                return ResponseEntity.ok(updatedUser);
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Failed to update user");
                return ResponseEntity.badRequest().body(response);
            }
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Unauthorized or user not found");
            return ResponseEntity.status(401).body(response);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam(required = false) String username, 
                                                 @RequestParam(required = false) String interest) {
        List<User> users;
        if (interest != null && !interest.isEmpty()) {
            users = userService.searchUsersByInterest(interest);
        } else if (username != null && !username.isEmpty()) {
            users = userService.searchUsersByUsername(username);
        } else {
            users = userService.getAllUsers();
        }
        
        // Remove passwords from response
        users.forEach(user -> user.setPassword(null));
        return ResponseEntity.ok(users);
    }

    @PostMapping("/{id}/follow/{followId}")
    public ResponseEntity<?> followUser(@PathVariable String id, @PathVariable String followId) {
        // Check if the authenticated user is the same as the user following
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        
        Optional<User> optionalUser = userService.getUserById(id);
        if (optionalUser.isPresent() && optionalUser.get().getUsername().equals(currentUsername)) {
            boolean success = userService.followUser(id, followId);
            if (success) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Successfully followed user");
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Failed to follow user");
                return ResponseEntity.badRequest().body(response);
            }
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Unauthorized or user not found");
            return ResponseEntity.status(401).body(response);
        }
    }

    @PostMapping("/{id}/unfollow/{unfollowId}")
    public ResponseEntity<?> unfollowUser(@PathVariable String id, @PathVariable String unfollowId) {
        // Check if the authenticated user is the same as the user unfollowing
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        
        Optional<User> optionalUser = userService.getUserById(id);
        if (optionalUser.isPresent() && optionalUser.get().getUsername().equals(currentUsername)) {
            boolean success = userService.unfollowUser(id, unfollowId);
            if (success) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Successfully unfollowed user");
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Failed to unfollow user");
                return ResponseEntity.badRequest().body(response);
            }
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Unauthorized or user not found");
            return ResponseEntity.status(401).body(response);
        }
    }
}
