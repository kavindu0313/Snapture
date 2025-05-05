package com.photoshare.api.controller;

import com.photoshare.api.model.Comment;
import com.photoshare.api.model.Notification;
import com.photoshare.api.model.Post;
import com.photoshare.api.model.User;
import com.photoshare.api.service.CommentService;
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
@RequestMapping("/comments")
@CrossOrigin(origins = "http://localhost:3000")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private UserService userService;

    @Autowired
    private PostService postService;

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Comment>> getCommentsByPostId(@PathVariable String postId) {
        List<Comment> comments = commentService.getCommentsByPostId(postId);
        return ResponseEntity.ok(comments);
    }

    @PostMapping
    public ResponseEntity<?> createComment(@RequestBody Comment comment) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        
        Optional<User> optionalUser = userService.getUserByUsername(currentUsername);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            comment.setUserId(user.getId());
            comment.setUsername(user.getUsername());
            comment.setUserProfilePic(user.getProfilePicture());
            
            Comment savedComment = commentService.createComment(comment);
            
            // Send notification to post owner if it's not the same user
            Optional<Post> optionalPost = postService.getPostById(comment.getPostId());
            if (optionalPost.isPresent()) {
                Post post = optionalPost.get();
                if (!post.getUserId().equals(user.getId())) {
                    Notification notification = new Notification();
                    notification.setUserId(post.getUserId());
                    notification.setSenderId(user.getId());
                    notification.setSenderUsername(user.getUsername());
                    notification.setSenderProfilePic(user.getProfilePicture());
                    notification.setType("comment");
                    notification.setPostId(post.getId());
                    notification.setMessage(user.getUsername() + " commented on your post: " + comment.getContent());
                    notificationService.createNotification(notification);
                }
            }
            
            return ResponseEntity.ok(savedComment);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "User not found");
            return ResponseEntity.status(404).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateComment(@PathVariable String id, @RequestBody Comment commentDetails) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        
        Optional<Comment> optionalComment = commentService.getCommentById(id);
        if (optionalComment.isPresent()) {
            Comment comment = optionalComment.get();
            
            // Check if the authenticated user is the owner of the comment
            if (comment.getUsername().equals(currentUsername)) {
                Comment updatedComment = commentService.updateComment(id, commentDetails);
                if (updatedComment != null) {
                    return ResponseEntity.ok(updatedComment);
                } else {
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Failed to update comment");
                    return ResponseEntity.badRequest().body(response);
                }
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Unauthorized");
                return ResponseEntity.status(401).body(response);
            }
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Comment not found");
            return ResponseEntity.status(404).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        
        Optional<Comment> optionalComment = commentService.getCommentById(id);
        if (optionalComment.isPresent()) {
            Comment comment = optionalComment.get();
            
            // Check if the authenticated user is the owner of the comment
            if (comment.getUsername().equals(currentUsername)) {
                boolean deleted = commentService.deleteComment(id);
                if (deleted) {
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Comment deleted successfully");
                    return ResponseEntity.ok(response);
                } else {
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Failed to delete comment");
                    return ResponseEntity.badRequest().body(response);
                }
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Unauthorized");
                return ResponseEntity.status(401).body(response);
            }
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Comment not found");
            return ResponseEntity.status(404).body(response);
        }
    }
}
