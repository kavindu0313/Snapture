package backend.controller;

import backend.model.CommentModel;
import backend.model.Notification;
import backend.model.PostModel;
import backend.repostry.CommentRepository;
import backend.repostry.NotificationRepository;
import backend.repostry.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@CrossOrigin("http://localhost:3000")
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private NotificationRepository notificationRepository;

    // Get all comments for a post
    @GetMapping("/posts/{postId}/comments")
    public List<CommentModel> getCommentsByPostId(@PathVariable String postId) {
        return commentRepository.findByPostIdOrderByCreatedAtDesc(postId);
    }
    
    // Create a new comment
    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<?> createComment(
            @PathVariable String postId,
            @RequestBody CommentModel commentModel) {
        
        // Check if post exists
        PostModel post = postRepository.findByPostId(postId);
        if (post == null) {
            return ResponseEntity.status(404).body("Post not found with ID: " + postId);
        }
        
        // Generate a unique comment ID
        commentModel.setCommentId(UUID.randomUUID().toString());
        commentModel.setPostId(postId);
        commentModel.setCreatedAt(LocalDateTime.now());
        commentModel.setUpdatedAt(LocalDateTime.now());
        
        CommentModel savedComment = commentRepository.save(commentModel);
        
        // Increment comment count on post
        post.setCommentCount(post.getCommentCount() + 1);
        postRepository.save(post);
        
        // Create notification for post owner (if commenter is not the owner)
        if (!post.getUserId().equals(commentModel.getUserId())) {
            Notification notification = new Notification(
                post.getUserId(),
                "comment",
                commentModel.getUsername() + " commented on your post: \"" + 
                    (commentModel.getContent().length() > 50 ? 
                    commentModel.getContent().substring(0, 47) + "..." : 
                    commentModel.getContent()) + "\"",
                postId,
                commentModel.getUserId(),
                commentModel.getUsername()
            );
            notificationRepository.save(notification);
        }
        
        return ResponseEntity.ok(savedComment);
    }
    
    // Update a comment
    @PutMapping("/comments/{commentId}")
    public ResponseEntity<?> updateComment(
            @PathVariable String commentId,
            @RequestBody Map<String, String> payload) {
        
        CommentModel comment = commentRepository.findByCommentId(commentId);
        if (comment == null) {
            return ResponseEntity.status(404).body("Comment not found with ID: " + commentId);
        }
        
        // Check if the user is the owner of the comment
        String userId = payload.get("userId");
        if (!comment.getUserId().equals(userId)) {
            return ResponseEntity.status(403).body("You are not authorized to update this comment");
        }
        
        String content = payload.get("content");
        if (content != null && !content.trim().isEmpty()) {
            comment.setContent(content);
            comment.setUpdatedAt(LocalDateTime.now());
            CommentModel updatedComment = commentRepository.save(comment);
            return ResponseEntity.ok(updatedComment);
        } else {
            return ResponseEntity.status(400).body("Comment content cannot be empty");
        }
    }
    
    // Delete a comment
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<?> deleteComment(
            @PathVariable String commentId,
            @RequestParam String userId) {
        
        CommentModel comment = commentRepository.findByCommentId(commentId);
        if (comment == null) {
            return ResponseEntity.status(404).body("Comment not found with ID: " + commentId);
        }
        
        // Get the post
        PostModel post = postRepository.findByPostId(comment.getPostId());
        if (post == null) {
            return ResponseEntity.status(404).body("Post not found with ID: " + comment.getPostId());
        }
        
        // Check if the user is the owner of the comment or the post
        if (!comment.getUserId().equals(userId) && !post.getUserId().equals(userId)) {
            return ResponseEntity.status(403).body("You are not authorized to delete this comment");
        }
        
        commentRepository.delete(comment);
        
        // Decrement comment count on post
        post.setCommentCount(Math.max(0, post.getCommentCount() - 1));
        postRepository.save(post);
        
        return ResponseEntity.ok("Comment deleted successfully");
    }
    
    // Get comments by user
    @GetMapping("/users/{userId}/comments")
    public List<CommentModel> getCommentsByUserId(@PathVariable String userId) {
        return commentRepository.findByUserId(userId);
    }
}
