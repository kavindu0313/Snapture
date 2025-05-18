package com.photoshare.api.controller;

import com.photoshare.api.model.Like;
import com.photoshare.api.model.Notification;
import com.photoshare.api.model.Post;
import com.photoshare.api.model.User;
import com.photoshare.api.service.LikeService;
import com.photoshare.api.service.NotificationService;
import com.photoshare.api.service.PostService;
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
@RequestMapping("/likes")
@CrossOrigin(origins = "http://localhost:3000")

// LikeController @CrossOrigin(origins = "http://localhost:3000")
public class LikeController {

    @Autowired
    private LikeService likeService;

    @Autowired
    private UserService userService;

    @Autowired
    private PostService postService;

    @Autowired
    private NotificationService notificationService;

    // Get all likes for a specific post
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Like>> getLikesByPostId(@PathVariable String postId) {
        List<Like> likes = likeService.getLikesByPostId(postId);
        return ResponseEntity.ok(likes);
    }

    @PostMapping
    public ResponseEntity<?> toggleLike(@RequestBody Map<String, String> request) {
        String postId = request.get("postId");
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        
        Optional<User> optionalUser = userService.getUserByUsername(currentUsername);
        if (optionalUser.isPresent() && postId != null) {
            User user = optionalUser.get();
            
            Like like = new Like();
            like.setPostId(postId);
            like.setUserId(user.getId());
            like.setUsername(user.getUsername());
            
            boolean isLiked = likeService.toggleLike(like);
            
            // If post was liked (not unliked), send notification to post owner
            if (isLiked) {
                Optional<Post> optionalPost = postService.getPostById(postId);
                if (optionalPost.isPresent()) {
                    Post post = optionalPost.get();
                    if (!post.getUserId().equals(user.getId())) {
                        Notification notification = new Notification();
                        notification.setUserId(post.getUserId());
                        notification.setSenderId(user.getId());
                        notification.setSenderUsername(user.getUsername());
                        notification.setSenderProfilePic(user.getProfilePicture());
                        notification.setType("like");
                        notification.setPostId(post.getId());
                        notification.setMessage(user.getUsername() + " liked your post");
                        notificationService.createNotification(notification);
                    }
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("liked", isLiked);
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "User not found or post ID not provided");
            return ResponseEntity.status(404).body(response);
        }
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkIfUserLikedPost(
            @RequestParam String postId) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        
        Optional<User> optionalUser = userService.getUserByUsername(currentUsername);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            boolean liked = likeService.checkIfUserLikedPost(postId, user.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("liked", liked);
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "User not found");
            return ResponseEntity.status(404).body(response);
        }
    }
}
