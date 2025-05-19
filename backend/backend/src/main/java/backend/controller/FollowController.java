package backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import backend.model.userModel;
import backend.repostry.userRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@CrossOrigin("http://localhost:3000")
public class FollowController {

    @Autowired
    private userRepository userRepository;

    // Follow a user
    @PostMapping("/users/{userId}/follow/{targetUserId}")
    public ResponseEntity<?> followUser(@PathVariable Long userId, @PathVariable Long targetUserId) {
        // Check if both users exist
        userModel currentUser = userRepository.findById(userId).orElse(null);
        userModel targetUser = userRepository.findById(targetUserId).orElse(null);
        
        if (currentUser == null || targetUser == null) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "User not found");
            return ResponseEntity.badRequest().body(response);
        }
        
        // Check if user is trying to follow themselves
        if (userId.equals(targetUserId)) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "You cannot follow yourself");
            return ResponseEntity.badRequest().body(response);
        }
        
        // Add target user to current user's following list
        currentUser.addFollowing(targetUserId.toString());
        
        // Add current user to target user's followers list
        targetUser.addFollower(userId.toString());
        
        // Save both users
        userRepository.save(currentUser);
        userRepository.save(targetUser);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Successfully followed user");
        response.put("followingCount", currentUser.getFollowingCount());
        response.put("followerCount", targetUser.getFollowerCount());
        
        return ResponseEntity.ok(response);
    }
    
    // Unfollow a user
    @DeleteMapping("/users/{userId}/unfollow/{targetUserId}")
    public ResponseEntity<?> unfollowUser(@PathVariable Long userId, @PathVariable Long targetUserId) {
        // Check if both users exist
        userModel currentUser = userRepository.findById(userId).orElse(null);
        userModel targetUser = userRepository.findById(targetUserId).orElse(null);
        
        if (currentUser == null || targetUser == null) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "User not found");
            return ResponseEntity.badRequest().body(response);
        }
        
        // Remove target user from current user's following list
        currentUser.removeFollowing(targetUserId.toString());
        
        // Remove current user from target user's followers list
        targetUser.removeFollower(userId.toString());
        
        // Save both users
        userRepository.save(currentUser);
        userRepository.save(targetUser);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Successfully unfollowed user");
        response.put("followingCount", currentUser.getFollowingCount());
        response.put("followerCount", targetUser.getFollowerCount());
        
        return ResponseEntity.ok(response);
    }
    
    // Get followers of a user
    @GetMapping("/users/{userId}/followers")
    public ResponseEntity<?> getFollowers(@PathVariable Long userId) {
        userModel user = userRepository.findById(userId).orElse(null);
        
        if (user == null) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "User not found");
            return ResponseEntity.badRequest().body(response);
        }
        
        List<String> followerIds = user.getFollowers();
        List<userModel> followers = followerIds.stream()
            .<userModel>map(id -> userRepository.findById(Long.parseLong(id)).orElse(null))
            .filter(u -> u != null)
            .collect(Collectors.toList());
        
        // Convert to simplified user objects for response
        List<Map<String, Object>> followersList = followers.stream().map(follower -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", follower.getId());
            map.put("fullname", follower.getFullname());
            map.put("profileImageUrl", follower.getProfileImageUrl());
            return map;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(followersList);
    }
    
    // Get users that a user is following
    @GetMapping("/users/{userId}/following")
    public ResponseEntity<?> getFollowing(@PathVariable Long userId) {
        userModel user = userRepository.findById(userId).orElse(null);
        
        if (user == null) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "User not found");
            return ResponseEntity.badRequest().body(response);
        }
        
        List<String> followingIds = user.getFollowing();
        List<userModel> following = followingIds.stream()
            .<userModel>map(id -> userRepository.findById(Long.parseLong(id)).orElse(null))
            .filter(u -> u != null)
            .collect(Collectors.toList());
        
        // Convert to simplified user objects for response
        List<Map<String, Object>> followingList = following.stream().map(followedUser -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", followedUser.getId());
            map.put("fullname", followedUser.getFullname());
            map.put("profileImageUrl", followedUser.getProfileImageUrl());
            return map;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(followingList);
    }
    
    // Check if a user is following another user
    @GetMapping("/users/{userId}/isFollowing/{targetUserId}")
    public ResponseEntity<?> isFollowing(@PathVariable Long userId, @PathVariable Long targetUserId) {
        userModel user = userRepository.findById(userId).orElse(null);
        
        if (user == null) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "User not found");
            return ResponseEntity.badRequest().body(response);
        }
        
        boolean isFollowing = user.getFollowing().contains(targetUserId.toString());
        
        Map<String, Object> response = new HashMap<>();
        response.put("isFollowing", isFollowing);
        
        return ResponseEntity.ok(response);
    }
}
