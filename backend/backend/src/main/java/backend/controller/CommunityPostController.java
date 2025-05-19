package backend.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.UUID;

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
import backend.model.CommunityPostModel;
import backend.model.userModel;
import backend.repostry.CommunityPostRepository;
import backend.repostry.CommunityRepository;
import backend.repostry.userRepository;

@RestController
@CrossOrigin("http://localhost:3000")
public class CommunityPostController {
    
    @Autowired
    private CommunityPostRepository communityPostRepository;
    
    @Autowired
    private CommunityRepository communityRepository;
    
    @Autowired
    private userRepository userRepository;
    
    // Create a new community post
    @PostMapping("/communities/{communityId}/posts")
    public ResponseEntity<?> createCommunityPost(
            @PathVariable String communityId,
            @RequestBody Map<String, Object> postData) {
        try {
            // Check if community exists
            CommunityModel community = communityRepository.findByCommunityId(communityId)
                    .orElseThrow(() -> new Exception("Community not found with id: " + communityId));
            
            // Check if user exists and is a member of the community
            Long authorId = Long.parseLong(postData.get("authorId").toString());
            userModel author = userRepository.findById(authorId)
                    .orElseThrow(() -> new userNotFoundException("User not found with id: " + authorId));
            
            if (!community.isMember(authorId.toString())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "You must be a member of the community to create posts"));
            }
            
            // Create a new post
            String postId = UUID.randomUUID().toString();
            String title = postData.get("title").toString();
            String content = postData.get("content").toString();
            
            CommunityPostModel post = new CommunityPostModel(
                    postId,
                    communityId,
                    authorId.toString(),
                    author.getFullname(),
                    title,
                    content
            );
            
            // Save the post
            CommunityPostModel savedPost = communityPostRepository.save(post);
            
            // Increment post count in community
            community.incrementPostCount();
            communityRepository.save(community);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(savedPost);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    // Get all posts in a community
    @GetMapping("/communities/{communityId}/posts")
    public ResponseEntity<?> getCommunityPosts(@PathVariable String communityId) {
        try {
            // Check if community exists
            communityRepository.findByCommunityId(communityId)
                    .orElseThrow(() -> new Exception("Community not found with id: " + communityId));
            
            // Get all posts in the community
            List<CommunityPostModel> posts = communityPostRepository.findByCommunityIdOrderByCreatedAtDesc(communityId);
            
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    // Get a specific post
    @GetMapping("/communities/posts/{postId}")
    public ResponseEntity<?> getCommunityPost(@PathVariable String postId) {
        try {
            CommunityPostModel post = communityPostRepository.findByPostId(postId)
                    .orElseThrow(() -> new Exception("Post not found with id: " + postId));
            
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    // Update a post
    @PutMapping("/communities/posts/{postId}")
    public ResponseEntity<?> updateCommunityPost(
            @PathVariable String postId,
            @RequestBody Map<String, Object> updateData) {
        try {
            CommunityPostModel post = communityPostRepository.findByPostId(postId)
                    .orElseThrow(() -> new Exception("Post not found with id: " + postId));
            
            // Check if user is the author or a moderator
            String userId = updateData.get("userId").toString();
            CommunityModel community = communityRepository.findByCommunityId(post.getCommunityId())
                    .orElseThrow(() -> new Exception("Community not found"));
            
            if (!post.getAuthorId().equals(userId) && !community.isModerator(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "You don't have permission to update this post"));
            }
            
            // Update post details
            if (updateData.containsKey("title")) {
                post.setTitle(updateData.get("title").toString());
            }
            
            if (updateData.containsKey("content")) {
                post.setContent(updateData.get("content").toString());
            }
            
            CommunityPostModel updatedPost = communityPostRepository.save(post);
            
            return ResponseEntity.ok(updatedPost);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    // Delete a post
    @DeleteMapping("/communities/posts/{postId}")
    public ResponseEntity<?> deleteCommunityPost(
            @PathVariable String postId,
            @RequestParam String userId) {
        try {
            CommunityPostModel post = communityPostRepository.findByPostId(postId)
                    .orElseThrow(() -> new Exception("Post not found with id: " + postId));
            
            // Check if user is the author or a moderator
            CommunityModel community = communityRepository.findByCommunityId(post.getCommunityId())
                    .orElseThrow(() -> new Exception("Community not found"));
            
            if (!post.getAuthorId().equals(userId) && !community.isModerator(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "You don't have permission to delete this post"));
            }
            
            // Delete the post
            communityPostRepository.delete(post);
            
            // Decrement post count in community
            community.decrementPostCount();
            communityRepository.save(community);
            
            return ResponseEntity.ok(Map.of("message", "Post deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    // Like a post
    @PostMapping("/communities/posts/{postId}/like")
    public ResponseEntity<?> likePost(
            @PathVariable String postId,
            @RequestParam String userId) {
        try {
            CommunityPostModel post = communityPostRepository.findByPostId(postId)
                    .orElseThrow(() -> new Exception("Post not found with id: " + postId));
            
            post.addLike(userId);
            communityPostRepository.save(post);
            
            return ResponseEntity.ok(Map.of(
                    "message", "Post liked successfully",
                    "likeCount", post.getLikeCount()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    // Unlike a post
    @DeleteMapping("/communities/posts/{postId}/like")
    public ResponseEntity<?> unlikePost(
            @PathVariable String postId,
            @RequestParam String userId) {
        try {
            CommunityPostModel post = communityPostRepository.findByPostId(postId)
                    .orElseThrow(() -> new Exception("Post not found with id: " + postId));
            
            post.removeLike(userId);
            communityPostRepository.save(post);
            
            return ResponseEntity.ok(Map.of(
                    "message", "Post unliked successfully",
                    "likeCount", post.getLikeCount()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    // Upload image for a post
    @PostMapping("/communities/posts/{postId}/image")
    public ResponseEntity<?> uploadPostImage(
            @PathVariable String postId,
            @RequestParam("file") MultipartFile file,
            @RequestParam String userId) {
        try {
            CommunityPostModel post = communityPostRepository.findByPostId(postId)
                    .orElseThrow(() -> new Exception("Post not found with id: " + postId));
            
            // Check if user is the author
            if (!post.getAuthorId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Only the author can upload images to this post"));
            }
            
            // Use the project root uploads directory
            String uploadDir = "./uploads/community-posts";
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            System.out.println("Upload directory path for posts: " + uploadPath);
            
            // Generate a unique filename
            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(filename);
            
            // Save the file
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Update the post with the new image URL
            post.setImageUrl(filename);
            communityPostRepository.save(post);
            
            return ResponseEntity.ok(Map.of(
                    "message", "Image uploaded successfully",
                    "imageUrl", filename,
                    "post", post
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    // Get posts by a specific user in communities
    @GetMapping("/users/{userId}/community-posts")
    public ResponseEntity<?> getUserCommunityPosts(@PathVariable String userId) {
        try {
            List<CommunityPostModel> posts = communityPostRepository.findByAuthorId(userId);
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
}
