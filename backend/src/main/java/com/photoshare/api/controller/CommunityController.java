package com.photoshare.api.controller;

import com.photoshare.api.model.Community;
import com.photoshare.api.model.Notification;
import com.photoshare.api.model.User;
import com.photoshare.api.service.CommunityService;
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
@RequestMapping("/communities")
@CrossOrigin(origins = "http://localhost:3000")
public class CommunityController {

    @Autowired
    private CommunityService communityService;

    @Autowired
    private UserService userService;

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<Community>> getAllCommunities() {
        List<Community> communities = communityService.getAllCommunities();
        return ResponseEntity.ok(communities);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCommunityById(@PathVariable String id) {
        Optional<Community> community = communityService.getCommunityById(id);
        if (community.isPresent()) {
            return ResponseEntity.ok(community.get());
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Community not found");
            return ResponseEntity.status(404).body(response);
        }
    }

    @PostMapping
    public ResponseEntity<?> createCommunity(@RequestBody Community community) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        
        Optional<User> optionalUser = userService.getUserByUsername(currentUsername);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            community.setCreatorId(user.getId());
            
            // Check if community name already exists
            if (communityService.getCommunityByName(community.getName()).isPresent()) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Community name already exists");
                return ResponseEntity.badRequest().body(response);
            }
            
            Community savedCommunity = communityService.createCommunity(community);
            return ResponseEntity.ok(savedCommunity);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "User not found");
            return ResponseEntity.status(404).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCommunity(@PathVariable String id, @RequestBody Community communityDetails) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        
        Optional<Community> optionalCommunity = communityService.getCommunityById(id);
        if (optionalCommunity.isPresent()) {
            Community community = optionalCommunity.get();
            
            // Check if the authenticated user is the creator of the community
            Optional<User> optionalUser = userService.getUserByUsername(currentUsername);
            if (optionalUser.isPresent() && optionalUser.get().getId().equals(community.getCreatorId())) {
                Community updatedCommunity = communityService.updateCommunity(id, communityDetails);
                if (updatedCommunity != null) {
                    return ResponseEntity.ok(updatedCommunity);
                } else {
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Failed to update community");
                    return ResponseEntity.badRequest().body(response);
                }
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Unauthorized");
                return ResponseEntity.status(401).body(response);
            }
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Community not found");
            return ResponseEntity.status(404).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCommunity(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        
        Optional<Community> optionalCommunity = communityService.getCommunityById(id);
        if (optionalCommunity.isPresent()) {
            Community community = optionalCommunity.get();
            
            // Check if the authenticated user is the creator of the community
            Optional<User> optionalUser = userService.getUserByUsername(currentUsername);
            if (optionalUser.isPresent() && optionalUser.get().getId().equals(community.getCreatorId())) {
                boolean deleted = communityService.deleteCommunity(id);
                if (deleted) {
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Community deleted successfully");
                    return ResponseEntity.ok(response);
                } else {
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Failed to delete community");
                    return ResponseEntity.badRequest().body(response);
                }
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Unauthorized");
                return ResponseEntity.status(401).body(response);
            }
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Community not found");
            return ResponseEntity.status(404).body(response);
        }
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<?> joinCommunity(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        
        Optional<User> optionalUser = userService.getUserByUsername(currentUsername);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            
            boolean joined = communityService.joinCommunity(id, user.getId());
            if (joined) {
                // Send notification to community creator
                Optional<Community> optionalCommunity = communityService.getCommunityById(id);
                if (optionalCommunity.isPresent()) {
                    Community community = optionalCommunity.get();
                    if (!community.getCreatorId().equals(user.getId())) {
                        Notification notification = new Notification();
                        notification.setUserId(community.getCreatorId());
                        notification.setSenderId(user.getId());
                        notification.setSenderUsername(user.getUsername());
                        notification.setSenderProfilePic(user.getProfilePicture());
                        notification.setType("community");
                        notification.setCommunityId(community.getId());
                        notification.setMessage(user.getUsername() + " joined your community: " + community.getName());
                        notificationService.createNotification(notification);
                    }
                }
                
                Map<String, String> response = new HashMap<>();
                response.put("message", "Successfully joined community");
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Failed to join community");
                return ResponseEntity.badRequest().body(response);
            }
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "User not found");
            return ResponseEntity.status(404).body(response);
        }
    }

    @PostMapping("/{id}/leave")
    public ResponseEntity<?> leaveCommunity(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        
        Optional<User> optionalUser = userService.getUserByUsername(currentUsername);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            
            boolean left = communityService.leaveCommunity(id, user.getId());
            if (left) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Successfully left community");
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Failed to leave community");
                return ResponseEntity.badRequest().body(response);
            }
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "User not found");
            return ResponseEntity.status(404).body(response);
        }
    }

    @GetMapping("/user")
    public ResponseEntity<List<Community>> getUserCommunities() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        
        Optional<User> optionalUser = userService.getUserByUsername(currentUsername);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            List<Community> communities = communityService.getUserCommunities(user.getId());
            return ResponseEntity.ok(communities);
        } else {
            return ResponseEntity.ok(List.of());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Community>> searchCommunities(@RequestParam(required = false) String name,
                                                           @RequestParam(required = false) String tag) {
        List<Community> communities;
        if (tag != null && !tag.isEmpty()) {
            communities = communityService.searchCommunitiesByTag(tag);
        } else if (name != null && !name.isEmpty()) {
            communities = communityService.searchCommunitiesByName(name);
        } else {
            communities = communityService.getAllCommunities();
        }
        
        return ResponseEntity.ok(communities);
    }
}
