package backend.controller;

import backend.exception.PostNotFoundException;
import backend.model.Notification;
import backend.model.PostModel;
import backend.repostry.NotificationRepository;
import backend.repostry.PostRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin("http://localhost:3000")
public class PostController {

    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private NotificationRepository notificationRepository;

    private final String UPLOAD_DIR = "uploads/posts/";

    // Create a new post
    @PostMapping("/posts")
    public PostModel createPost(@RequestBody PostModel postModel) {
        // Generate a unique postId if not provided
        if (postModel.getPostId() == null || postModel.getPostId().isEmpty()) {
            postModel.setPostId(UUID.randomUUID().toString());
        }
        
        // Set creation time if not provided
        if (postModel.getCreatedAt() == null) {
            postModel.setCreatedAt(LocalDateTime.now());
        }
        
        return postRepository.save(postModel);
    }
    
    // Create a learning progress post
    @PostMapping("/posts/learning-progress")
    public PostModel createLearningProgressPost(@RequestBody PostModel postModel) {
        // Set post type to learning_progress
        postModel.setPostType("learning_progress");
        
        // Generate a unique postId if not provided
        if (postModel.getPostId() == null || postModel.getPostId().isEmpty()) {
            postModel.setPostId(UUID.randomUUID().toString());
        }
        
        // Set creation time if not provided
        if (postModel.getCreatedAt() == null) {
            postModel.setCreatedAt(LocalDateTime.now());
        }
        
        return postRepository.save(postModel);
    }
    
    // Create a learning progress post with file upload
    @PostMapping("/posts/learning-progress/upload")
    public ResponseEntity<?> createLearningProgressPostWithUpload(
            @RequestPart(value = "postDetails") String postDetails,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            PostModel postModel;
            
            try {
                postModel = mapper.readValue(postDetails, PostModel.class);
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(400).body("Error parsing post details: " + e.getMessage());
            }
            
            // Set post type to learning_progress
            postModel.setPostType("learning_progress");
            
            // Generate a unique postId
            postModel.setPostId(UUID.randomUUID().toString());
            
            // Set creation time
            postModel.setCreatedAt(LocalDateTime.now());
            
            // Handle file upload if provided
            if (file != null && !file.isEmpty()) {
                String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                
                // Create directory if it doesn't exist
                File uploadDir = new File(UPLOAD_DIR);
                if (!uploadDir.exists()) {
                    uploadDir.mkdirs();
                }
                
                // Save the file
                file.transferTo(Paths.get(UPLOAD_DIR, fileName));
                
                // Set the image URL
                postModel.setImageUrl(fileName);
            }
            
            PostModel savedPost = postRepository.save(postModel);
            return ResponseEntity.ok(savedPost);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Unexpected error: " + e.getMessage());
        }
    }
    
    // Upload post image
    @PostMapping("/posts/upload")
    public String uploadPostImage(@RequestParam("file") MultipartFile file) {
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

        try {
            // Create directory if it doesn't exist
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs(); // creates all missing parent directories
            }

            // Save the file using safe path concatenation
            file.transferTo(Paths.get(UPLOAD_DIR, fileName));

        } catch (IOException e) {
            e.printStackTrace();
            return "Error uploading file: " + fileName;
        }

        return fileName;
    }
    
    // Get all posts (sorted by creation date, newest first)
    @GetMapping("/posts")
    public List<PostModel> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }
    
    // Get posts by type
    @GetMapping("/posts/type/{postType}")
    public List<PostModel> getPostsByType(@PathVariable String postType) {
        return postRepository.findByPostTypeOrderByCreatedAtDesc(postType);
    }
    
    // Get learning progress posts
    @GetMapping("/posts/learning-progress")
    public List<PostModel> getLearningProgressPosts() {
        return postRepository.findByPostTypeOrderByCreatedAtDesc("learning_progress");
    }
    
    // Get learning plan posts
    @GetMapping("/posts/learning-plans")
    public List<PostModel> getLearningPlanPosts() {
        return postRepository.findByPostTypeOrderByCreatedAtDesc("learning_plan");
    }
    
    // Get post by ID
    @GetMapping("/posts/{id}")
    public PostModel getPostById(@PathVariable Long id) {
        return postRepository.findById(id).orElseThrow(() -> new PostNotFoundException(id));
    }
    
    // Get post by postId
    @GetMapping("/posts/post/{postId}")
    public ResponseEntity<?> getPostByPostId(@PathVariable String postId) {
        PostModel post = postRepository.findByPostId(postId);
        if (post == null) {
            return ResponseEntity.status(404).body("Post with ID " + postId + " not found");
        }
        return ResponseEntity.ok(post);
    }
    
    // Get posts by userId
    @GetMapping("/posts/user/{userId}")
    public List<PostModel> getPostsByUserId(@PathVariable String userId) {
        return postRepository.findByUserId(userId);
    }
    
    // Get post image
    @GetMapping("/uploads/posts/{filename}")
    public ResponseEntity<FileSystemResource> getPostImage(@PathVariable String filename) {
        File file = new File(UPLOAD_DIR + filename);
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new FileSystemResource(file));
    }
    
    // Update post
    @PutMapping("/posts/{postId}")
    public ResponseEntity<?> updatePost(
            @RequestPart(value = "postDetails") String postDetails,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @PathVariable String postId
    ) {
        try {
            // Find the post by postId
            PostModel existingPost = postRepository.findByPostId(postId);
            if (existingPost == null) {
                return ResponseEntity.status(404).body("Post with ID " + postId + " not found");
            }
            
            ObjectMapper mapper = new ObjectMapper();
            PostModel updatedPost;
            try {
                updatedPost = mapper.readValue(postDetails, PostModel.class);
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(400).body("Error parsing post details: " + e.getMessage());
            }
            
            // Update the existing post with new values
            existingPost.setTitle(updatedPost.getTitle());
            existingPost.setContent(updatedPost.getContent());
            
            // Update learning progress fields if this is a learning progress post
            if ("learning_progress".equals(existingPost.getPostType())) {
                if (updatedPost.getTemplate() != null) {
                    existingPost.setTemplate(updatedPost.getTemplate());
                }
                
                // Update tutorial completion template fields
                if (updatedPost.getTutorialName() != null) {
                    existingPost.setTutorialName(updatedPost.getTutorialName());
                }
                if (updatedPost.getPlatform() != null) {
                    existingPost.setPlatform(updatedPost.getPlatform());
                }
                if (updatedPost.getSkillsLearned() != null && !updatedPost.getSkillsLearned().isEmpty()) {
                    existingPost.setSkillsLearned(updatedPost.getSkillsLearned());
                }
                if (updatedPost.getCompletionDate() != null) {
                    existingPost.setCompletionDate(updatedPost.getCompletionDate());
                }
                
                // Update new skill template fields
                if (updatedPost.getProficiencyLevel() != null) {
                    existingPost.setProficiencyLevel(updatedPost.getProficiencyLevel());
                }
                if (updatedPost.getLearningResources() != null && !updatedPost.getLearningResources().isEmpty()) {
                    existingPost.setLearningResources(updatedPost.getLearningResources());
                }
                if (updatedPost.getPracticeProjects() != null) {
                    existingPost.setPracticeProjects(updatedPost.getPracticeProjects());
                }
                
                // Update course milestone template fields
                if (updatedPost.getCourseName() != null) {
                    existingPost.setCourseName(updatedPost.getCourseName());
                }
                if (updatedPost.getMilestone() != null) {
                    existingPost.setMilestone(updatedPost.getMilestone());
                }
                if (updatedPost.getChallengesFaced() != null) {
                    existingPost.setChallengesFaced(updatedPost.getChallengesFaced());
                }
                if (updatedPost.getNextSteps() != null) {
                    existingPost.setNextSteps(updatedPost.getNextSteps());
                }
            }
            
            // Only update these if they're provided
            if (updatedPost.getUserId() != null) {
                existingPost.setUserId(updatedPost.getUserId());
            }
            
            if (updatedPost.getUsername() != null) {
                existingPost.setUsername(updatedPost.getUsername());
            }
    
            if (file != null && !file.isEmpty()) {
                String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
    
                try {
                    // Create directory if it doesn't exist
                    File uploadDir = new File(UPLOAD_DIR);
                    if (!uploadDir.exists()) {
                        uploadDir.mkdirs();
                    }
                    
                    // Save the file
                    file.transferTo(Paths.get(UPLOAD_DIR, fileName));
                    
                    // Delete old image if exists
                    if (existingPost.getImageUrl() != null && !existingPost.getImageUrl().isEmpty()) {
                        File oldImage = new File(UPLOAD_DIR + existingPost.getImageUrl());
                        if (oldImage.exists()) {
                            oldImage.delete();
                        }
                    }
                    
                    // Update the image URL in the model
                    existingPost.setImageUrl(fileName);
                } catch (IOException e) {
                    e.printStackTrace();
                    return ResponseEntity.status(500).body("Error saving upload file: " + e.getMessage());
                }
            }
            
            PostModel savedPost = postRepository.save(existingPost);
            return ResponseEntity.ok(savedPost);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Unexpected error: " + e.getMessage());
        }
    }
    
    // Like a post
    @PostMapping("/posts/{postId}/like")
    public ResponseEntity<?> likePost(
            @PathVariable String postId,
            @RequestParam String likerId,
            @RequestParam String likerUsername) {
        PostModel post = postRepository.findByPostId(postId);
        if (post == null) {
            return ResponseEntity.status(404).body("Post with ID " + postId + " not found");
        }
        
        post.setLikes(post.getLikes() + 1);
        postRepository.save(post);
        
        // Create notification for post owner (if liker is not the owner)
        if (!post.getUserId().equals(likerId)) {
            Notification notification = new Notification(
                post.getUserId(),
                "like",
                likerUsername + " liked your post",
                postId,
                likerId,
                likerUsername
            );
            notificationRepository.save(notification);
        }
        
        return ResponseEntity.ok(post);
    }
    
    // Delete post
    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable String postId) {
        PostModel post = postRepository.findByPostId(postId);
        if (post == null) {
            return ResponseEntity.status(404).body("Post with ID " + postId + " not found");
        }
        
        // Delete image if exists
        if (post.getImageUrl() != null && !post.getImageUrl().isEmpty()) {
            File imageFile = new File(UPLOAD_DIR + post.getImageUrl());
            if (imageFile.exists()) {
                imageFile.delete();
            }
        }
        
        postRepository.delete(post);
        return ResponseEntity.ok("Post with ID " + postId + " and associated image deleted");
    }
}
