package com.photoshare.api.service;

import com.photoshare.api.model.Post;
import com.photoshare.api.model.User;
import com.photoshare.api.repository.PostRepository;
import com.photoshare.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Optional<Post> getPostById(String id) {
        return postRepository.findById(id);
    }

    public List<Post> getPostsByUserId(String userId) {
        return postRepository.findByUserId(userId);
    }

    public Post createPost(Post post, MultipartFile image) throws IOException {
        String fileName = saveImage(image);
        post.setImageUrl(fileName);
        post.setCreatedAt(new Date());
        post.setUpdatedAt(new Date());
        return postRepository.save(post);
    }

    public Post updatePost(String id, Post postDetails) {
        Optional<Post> optionalPost = postRepository.findById(id);
        if (optionalPost.isPresent()) {
            Post post = optionalPost.get();
            post.setCaption(postDetails.getCaption());
            post.setTags(postDetails.getTags());
            post.setLocation(postDetails.getLocation());
            post.setUpdatedAt(new Date());
            return postRepository.save(post);
        }
        return null;
    }

    public boolean deletePost(String id) {
        if (postRepository.existsById(id)) {
            Optional<Post> post = postRepository.findById(id);
            if (post.isPresent() && post.get().getImageUrl() != null) {
                deleteImage(post.get().getImageUrl());
            }
            postRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Post> searchPostsByTag(String tag) {
        return postRepository.findByTags(tag);
    }

    public List<Post> getPostsByCommunityId(String communityId) {
        return postRepository.findByCommunityId(communityId);
    }

    public Page<Post> getFeedForUser(String userId, Pageable pageable) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            return postRepository.findByUserIdIn(user.getFollowing(), pageable);
        }
        return Page.empty();
    }

    private String saveImage(MultipartFile file) throws IOException {
        // Create the upload directory if it doesn't exist
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // Generate a unique file name
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir, fileName);
        
        // Save the file
        Files.write(filePath, file.getBytes());
        
        return fileName;
    }

    private void deleteImage(String fileName) {
        try {
            Path filePath = Paths.get(uploadDir, fileName);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            // Log the error
            e.printStackTrace();
        }
    }
}
