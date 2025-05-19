package backend.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import backend.exception.userNotFoundException;
import backend.model.CommunityModel;
import backend.model.Notification;
import backend.model.userModel;
import backend.repostry.CommunityRepository;
import backend.repostry.NotificationRepository;
import backend.repostry.userRepository;

@RestController
@CrossOrigin("http://localhost:3000")
public class CommunityController {
    
    @Autowired
    private CommunityRepository communityRepository;
    
    @Autowired
    private userRepository userRepository;
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    // Create a new community
    @PostMapping("/communities")
    public ResponseEntity<?> createCommunity(@RequestBody Map<String, Object> communityData) {
        try {
            Long userId = Long.parseLong(communityData.get("creatorId").toString());
            userModel creator = userRepository.findById(userId)
                    .orElseThrow(() -> new userNotFoundException("User not found with id: " + userId));
            
            String name = communityData.get("name").toString();
            String description = communityData.get("description").toString();
            
            // Check if community name already exists
            if (communityRepository.existsByName(name)) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("message", "A community with this name already exists"));
            }
            
            // Generate a unique communityId
            String communityId = UUID.randomUUID().toString();
            
            CommunityModel community = new CommunityModel(
                    communityId,
                    name,
                    description,
                    userId.toString(),
                    creator.getFullname()
            );
            
            CommunityModel savedCommunity = communityRepository.save(community);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(savedCommunity);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    // Get all communities
    @GetMapping("/communities")
    public ResponseEntity<?> getAllCommunities() {
        try {
            List<CommunityModel> communities = communityRepository.findAll();
            return ResponseEntity.ok(communities);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    // Get a specific community by ID
    @GetMapping("/communities/{communityId}")
    public ResponseEntity<?> getCommunity(@PathVariable String communityId) {
        try {
            CommunityModel community = communityRepository.findByCommunityId(communityId)
                    .orElseThrow(() -> new Exception("Community not found with id: " + communityId));
            
            return ResponseEntity.ok(community);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    // Update a community
    @PutMapping("/communities/{communityId}")
    public ResponseEntity<?> updateCommunity(
            @PathVariable String communityId,
            @RequestBody Map<String, Object> updateData) {
        try {
            CommunityModel community = communityRepository.findByCommunityId(communityId)
                    .orElseThrow(() -> new Exception("Community not found with id: " + communityId));
            
            // Check if user is a moderator
            String userId = updateData.get("userId").toString();
            if (!community.isModerator(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "You don't have permission to update this community"));
            }
            
            // Update community details
            if (updateData.containsKey("name")) {
                String newName = updateData.get("name").toString();
                // Check if new name is already taken by another community
                if (!community.getName().equals(newName) && communityRepository.existsByName(newName)) {
                    return ResponseEntity.status(HttpStatus.CONFLICT)
                            .body(Map.of("message", "A community with this name already exists"));
                }
                community.setName(newName);
            }
            
            if (updateData.containsKey("description")) {
                community.setDescription(updateData.get("description").toString());
            }
            
            CommunityModel updatedCommunity = communityRepository.save(community);
            
            return ResponseEntity.ok(updatedCommunity);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    // Delete a community
    @DeleteMapping("/communities/{communityId}")
    public ResponseEntity<?> deleteCommunity(
            @PathVariable String communityId,
            @RequestParam String userId) {
        try {
            CommunityModel community = communityRepository.findByCommunityId(communityId)
                    .orElseThrow(() -> new Exception("Community not found with id: " + communityId));
            
            // Only the creator can delete the community
            if (!community.getCreatorId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Only the creator can delete this community"));
            }
            
            communityRepository.delete(community);
            
            return ResponseEntity.ok(Map.of("message", "Community deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    // Join a community
    @PostMapping("/communities/{communityId}/join")
    public ResponseEntity<?> joinCommunity(
            @PathVariable String communityId,
            @RequestParam Long userId) {
        try {
            CommunityModel community = communityRepository.findByCommunityId(communityId)
                    .orElseThrow(() -> new Exception("Community not found with id: " + communityId));
            
            // Verify user exists and get user details for notification
            userModel user = userRepository.findById(userId)
                    .orElseThrow(() -> new userNotFoundException("User not found with id: " + userId));
            
            community.addMember(userId.toString());
            communityRepository.save(community);
            
            // Create notification for the user who joined - using user's fullname
            Notification notification = new Notification(
                userId.toString(),
                "community",
                "You have been added to the community: " + community.getName(),
                communityId,
                community.getCreatorId(),
                user.getFullname() // Using the user variable to get the fullname
            );
            notificationRepository.save(notification);
            
            return ResponseEntity.ok(Map.of(
                    "message", "Successfully joined the community",
                    "community", community
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    // Leave a community
    @PostMapping("/communities/{communityId}/leave")
    public ResponseEntity<?> leaveCommunity(
            @PathVariable String communityId,
            @RequestParam Long userId) {
        try {
            CommunityModel community = communityRepository.findByCommunityId(communityId)
                    .orElseThrow(() -> new Exception("Community not found with id: " + communityId));
            
            // Check if user is the creator
            if (community.getCreatorId().equals(userId.toString())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "The creator cannot leave the community"));
            }
            
            community.removeMember(userId.toString());
            communityRepository.save(community);
            
            return ResponseEntity.ok(Map.of(
                    "message", "Successfully left the community",
                    "community", community
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    // Add a moderator
    @PostMapping("/communities/{communityId}/moderators")
    public ResponseEntity<?> addModerator(
            @PathVariable String communityId,
            @RequestParam String adminUserId,
            @RequestParam String newModeratorId) {
        try {
            CommunityModel community = communityRepository.findByCommunityId(communityId)
                    .orElseThrow(() -> new Exception("Community not found with id: " + communityId));
            
            // Check if admin user is the creator
            if (!community.getCreatorId().equals(adminUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Only the creator can add moderators"));
            }
            
            // Check if new moderator is a member
            if (!community.isMember(newModeratorId)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "User must be a member before becoming a moderator"));
            }
            
            community.addModerator(newModeratorId);
            communityRepository.save(community);
            
            return ResponseEntity.ok(Map.of(
                    "message", "Moderator added successfully",
                    "moderators", community.getModerators()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    // Remove a moderator
    @DeleteMapping("/communities/{communityId}/moderators/{moderatorId}")
    public ResponseEntity<?> removeModerator(
            @PathVariable String communityId,
            @PathVariable String moderatorId,
            @RequestParam String adminUserId) {
        try {
            CommunityModel community = communityRepository.findByCommunityId(communityId)
                    .orElseThrow(() -> new Exception("Community not found with id: " + communityId));
            
            // Check if admin user is the creator
            if (!community.getCreatorId().equals(adminUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Only the creator can remove moderators"));
            }
            
            community.removeModerator(moderatorId);
            communityRepository.save(community);
            
            return ResponseEntity.ok(Map.of(
                    "message", "Moderator removed successfully",
                    "moderators", community.getModerators()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    // Get communities a user is a member of
    @GetMapping("/users/{userId}/communities")
    public ResponseEntity<?> getUserCommunities(@PathVariable Long userId) {
        try {
            List<CommunityModel> communities = communityRepository.findByMembersContaining(userId.toString());
            return ResponseEntity.ok(communities);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    // Search communities by name
    @GetMapping("/communities/search")
    public ResponseEntity<?> searchCommunities(@RequestParam String keyword) {
        try {
            List<CommunityModel> communities = communityRepository.findByNameContainingIgnoreCase(keyword);
            return ResponseEntity.ok(communities);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    // Upload community cover image
    @PostMapping("/communities/{communityId}/cover-image")
    public ResponseEntity<?> uploadCoverImage(
            @PathVariable String communityId,
            @RequestParam("file") MultipartFile file,
            @RequestParam String userId) {
        try {
            CommunityModel community = communityRepository.findByCommunityId(communityId)
                    .orElseThrow(() -> new Exception("Community not found with id: " + communityId));
            
            // Check if user is a moderator
            if (!community.isModerator(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Only moderators can update the cover image"));
            }
            
            // Use the project root uploads directory
            String uploadDir = "./uploads/communities";
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            System.out.println("Upload directory path: " + uploadPath);
            
            // Generate a unique filename
            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(filename);
            
            // Save the file
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Update the community with the new cover image URL
            community.setCoverImageUrl(filename);
            communityRepository.save(community);
            
            return ResponseEntity.ok(Map.of(
                    "message", "Cover image uploaded successfully",
                    "coverImageUrl", filename,
                    "community", community
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    // Get community members
    @GetMapping("/communities/{communityId}/members")
    public ResponseEntity<?> getCommunityMembers(@PathVariable String communityId) {
        try {
            CommunityModel community = communityRepository.findByCommunityId(communityId)
                    .orElseThrow(() -> new Exception("Community not found with id: " + communityId));
            
            List<String> memberIds = community.getMembers();
            List<Map<String, Object>> members = memberIds.stream()
                    .map(memberId -> {
                        try {
                            Long id = Long.parseLong(memberId);
                            userModel user = userRepository.findById(id)
                                    .orElse(null);
                            
                            if (user != null) {
                                Map<String, Object> memberData = new HashMap<>();
                                memberData.put("id", user.getId());
                                memberData.put("fullname", user.getFullname());
                                memberData.put("profileImageUrl", user.getProfileImageUrl());
                                memberData.put("isModerator", community.isModerator(memberId));
                                memberData.put("isCreator", community.getCreatorId().equals(memberId));
                                return memberData;
                            }
                            return null;
                        } catch (Exception e) {
                            return null;
                        }
                    })
                    .filter(member -> member != null)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(members);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
}
