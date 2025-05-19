package backend.controller;

import backend.exception.userNotFoundException;
import backend.model.userModel;
import backend.model.PostModel;
import backend.repostry.userRepository;
import backend.repostry.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@CrossOrigin("http://localhost:3000")
public class userController {

    @Autowired
    private userRepository userRepository;
    
    @Autowired
    private PostRepository postRepository;

    // Insert new user
    @PostMapping("/user")
    public userModel newUserModel(@RequestBody userModel newUserModel) {
        return userRepository.save(newUserModel);
    }

    // User login
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody userModel loginDetails) {
        try {
            // Debug logging
            System.out.println("Login attempt with email: " + loginDetails.getEmail());
            
            // Try to find the user by email
            java.util.Optional<userModel> userOpt = userRepository.findByEmail(loginDetails.getEmail());
            
            // If user not found, return appropriate error
            if (!userOpt.isPresent()) {
                System.out.println("User not found with email: " + loginDetails.getEmail());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid email or password"));
            }
            
            userModel user = userOpt.get();
            System.out.println("User found: " + user.getFullname());
            
            // Check if password matches
            if (user.getPassword().equals(loginDetails.getPassword())) {
                System.out.println("Password matched for user: " + user.getEmail());
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Login Successful");
                response.put("id", user.getId());
                return ResponseEntity.ok(response);
            } else {
                System.out.println("Password mismatch for user: " + user.getEmail());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid email or password"));
            }
        } catch (Exception e) {
            // Log the exception for debugging
            System.err.println("Login error: " + e.getMessage());
            e.printStackTrace();
            
            // Return a user-friendly error message
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "An error occurred during login. Please try again later."));
        }
    }
    
    // Get user by ID
    @GetMapping("/user/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            userModel user = userRepository.findById(id)
                    .orElseThrow(() -> new userNotFoundException("User not found with id: " + id));
            
            // Don't send password in the response
            user.setPassword(null);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    // Update user profile
    @PutMapping("/user/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody userModel updatedUser) {
        try {
            userModel user = userRepository.findById(id)
                    .orElseThrow(() -> new userNotFoundException("User not found with id: " + id));
            
            // Update user fields
            user.setFullname(updatedUser.getFullname());
            user.setEmail(updatedUser.getEmail());
            user.setPhone(updatedUser.getPhone());
            
            // Update new social profile fields
            if (updatedUser.getBio() != null) {
                user.setBio(updatedUser.getBio());
            }
            
            if (updatedUser.getProfileImageUrl() != null) {
                user.setProfileImageUrl(updatedUser.getProfileImageUrl());
            }
            
            // Only update password if provided
            if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                user.setPassword(updatedUser.getPassword());
            }
            
            userModel savedUser = userRepository.save(user);
            savedUser.setPassword(null); // Don't return password
            
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    // Upload profile image
    @PostMapping("/user/{id}/upload-profile-image")
    public ResponseEntity<?> uploadProfileImage(@PathVariable Long id, @RequestParam("image") MultipartFile file) {
        try {
            userModel user = userRepository.findById(id)
                    .orElseThrow(() -> new userNotFoundException("User not found with id: " + id));
            
            // Create uploads directory if it doesn't exist
            String uploadDir = "uploads/profiles";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // Generate unique filename
            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(filename);
            
            // Save the file
            Files.copy(file.getInputStream(), filePath);
            
            // Update user profile image URL
            user.setProfileImageUrl(filename);
            userRepository.save(user);
            
            // Create full URL for the image
            String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/profiles/")
                    .path(filename)
                    .toUriString();
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Profile image uploaded successfully");
            response.put("profileImageUrl", filename);
            response.put("downloadUrl", fileDownloadUri);
            
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to upload profile image: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    // Get user posts
    @GetMapping("/user/{id}/posts")
    public ResponseEntity<?> getUserPosts(@PathVariable Long id) {
        try {
            // Verify user exists
            userRepository.findById(id)
                    .orElseThrow(() -> new userNotFoundException("User not found with id: " + id));
            
            List<PostModel> posts = postRepository.findByUserId(id.toString());
            
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    // Get public user profile
    @GetMapping("/user/{id}/profile")
    public ResponseEntity<?> getUserProfile(@PathVariable Long id) {
        try {
            userModel user = userRepository.findById(id)
                    .orElseThrow(() -> new userNotFoundException("User not found with id: " + id));
            
            // Create a public profile object with only necessary information
            Map<String, Object> profile = new HashMap<>();
            profile.put("id", user.getId());
            profile.put("fullname", user.getFullname());
            profile.put("bio", user.getBio());
            profile.put("profileImageUrl", user.getProfileImageUrl());
            profile.put("followerCount", user.getFollowerCount());
            profile.put("followingCount", user.getFollowingCount());
            profile.put("postCount", user.getPostCount());
            
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    // Get user suggestions (users not being followed)
    @GetMapping("/users/suggestions")
    public ResponseEntity<?> getUserSuggestions(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "5") int limit) {
        try {
            userModel currentUser = userRepository.findById(userId)
                    .orElseThrow(() -> new userNotFoundException("User not found with id: " + userId));
            
            // Get all users
            List<userModel> allUsers = userRepository.findAll();
            
            // Get the IDs of users that the current user is following
            List<String> followingIds = currentUser.getFollowing();
            
            // Filter out users that are already being followed and the current user
            List<Map<String, Object>> suggestions = allUsers.stream()
                    .filter(user -> !followingIds.contains(user.getId().toString()) && !user.getId().equals(userId))
                    .limit(limit)
                    .map(user -> {
                        Map<String, Object> userMap = new HashMap<>();
                        userMap.put("id", user.getId());
                        userMap.put("fullname", user.getFullname());
                        userMap.put("profileImageUrl", user.getProfileImageUrl());
                        return userMap;
                    })
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(suggestions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
}
