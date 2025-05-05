package com.photoshare.api.controller;

import com.photoshare.api.model.Post;
import com.photoshare.api.model.User;
import com.photoshare.api.service.CommunityService;
import com.photoshare.api.service.NotificationService;
import com.photoshare.api.service.PostService;
import com.photoshare.api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/posts")
@CrossOrigin(origins = "http://localhost:3000")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private UserService userService;

    @Autowired
    private CommunityService communityService;

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        List<Post> posts = postService.getAllPosts();
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPostById(@PathVariable String id) {
        Optional<Post> post = postService.getPostById(id);
        if (post.isPresent()) {
            return ResponseEntity.ok(post.get());
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Post not found");
            return ResponseEntity.status(404).body(response);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Post>> getPostsByUserId(@PathVariable String userId) {
        List<Post> posts = postService.getPostsByUserId(userId);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/community/{communityId}")
    public ResponseEntity<List<Post>> getPostsByCommunityId(@PathVariable String communityId) {
        List<Post> posts = postService.getPostsByCommunityId(communityId);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/feed")
    public ResponseEntity<Page<Post>> getFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        
        Optional<User> optionalUser = userService.getUserByUsername(currentUsername);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            PageRequest pageRequest = PageRequest.of(page, size, Sort.by("createdAt").descending());
            Page<Post> posts = postService.getFeedForUser(user.getId(), pageRequest);
            return ResponseEntity.ok(posts);
        } else {
            return ResponseEntity.ok(Page.empty());
        }
    }

    @PostMapping
    public ResponseEntity<?> createPost(
            @RequestParam("image") MultipartFile image,
            @RequestParam("caption") String caption,
            @RequestParam(value = "communityId", required = false) String communityId,
            @RequestParam(value = "tags", required = false) List<String> tags,
            @RequestParam(value = "location", required = false) String location) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        
        Optional<User> optionalUser = userService.getUserByUsername(currentUsername);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            
            Post post = new Post();
            post.setUserId(user.getId());
            post.setUsername(user.getUsername());
            post.setCaption(caption);
            if (tags != null) {
                post.setTags(tags);
            }
            if (location != null) {
                post.setLocation(location);
            }
            if (communityId != null && !communityId.isEmpty()) {
                post.setCommunityId(communityId);
                communityService.incrementPostCount(communityId);
            }
            
            try {
                Post savedPost = postService.createPost(post, image);
                return ResponseEntity.ok(savedPost);
            } catch (IOException e) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Failed to upload image: " + e.getMessage());
                return ResponseEntity.badRequest().body(response);
            }
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "User not found");
            return ResponseEntity.status(404).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(@PathVariable String id, @RequestBody Post postDetails) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        
        Optional<Post> optionalPost = postService.getPostById(id);
        if (optionalPost.isPresent()) {
            Post post = optionalPost.get();
            
            // Check if the authenticated user is the owner of the post
            if (post.getUsername().equals(currentUsername)) {
                Post updatedPost = postService.updatePost(id, postDetails);
                if (updatedPost != null) {
                    return ResponseEntity.ok(updatedPost);
                } else {
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Failed to update post");
                    return ResponseEntity.badRequest().body(response);
                }
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Unauthorized");
                return ResponseEntity.status(401).body(response);
            }
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Post not found");
            return ResponseEntity.status(404).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        
        Optional<Post> optionalPost = postService.getPostById(id);
        if (optionalPost.isPresent()) {
            Post post = optionalPost.get();
            
            // Check if the authenticated user is the owner of the post
            if (post.getUsername().equals(currentUsername)) {
                // If post belongs to a community, decrement post count
                if (post.getCommunityId() != null && !post.getCommunityId().isEmpty()) {
                    communityService.decrementPostCount(post.getCommunityId());
                }
                
                boolean deleted = postService.deletePost(id);
                if (deleted) {
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Post deleted successfully");
                    return ResponseEntity.ok(response);
                } else {
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Failed to delete post");
                    return ResponseEntity.badRequest().body(response);
                }
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Unauthorized");
                return ResponseEntity.status(401).body(response);
            }
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Post not found");
            return ResponseEntity.status(404).body(response);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Post>> searchPosts(@RequestParam(required = false) String tag,
                                                 @RequestParam(required = false) String caption) {
        List<Post> posts;
        if (tag != null && !tag.isEmpty()) {
            posts = postService.searchPostsByTag(tag);
        } else if (caption != null && !caption.isEmpty()) {
            posts = postService.searchPostsByTag(caption);
        } else {
            posts = postService.getAllPosts();
        }
        
        return ResponseEntity.ok(posts);
    }
}
