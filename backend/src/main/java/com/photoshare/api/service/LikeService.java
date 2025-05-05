package com.photoshare.api.service;

import com.photoshare.api.model.Like;
import com.photoshare.api.model.Post;
import com.photoshare.api.repository.LikeRepository;
import com.photoshare.api.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class LikeService {

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private PostRepository postRepository;

    public List<Like> getLikesByPostId(String postId) {
        return likeRepository.findByPostId(postId);
    }

    public boolean toggleLike(Like like) {
        Optional<Like> existingLike = likeRepository.findByPostIdAndUserId(like.getPostId(), like.getUserId());
        
        if (existingLike.isPresent()) {
            // Unlike
            likeRepository.delete(existingLike.get());
            
            // Update post like count
            Optional<Post> optionalPost = postRepository.findById(like.getPostId());
            if (optionalPost.isPresent()) {
                Post post = optionalPost.get();
                post.setLikesCount(Math.max(0, post.getLikesCount() - 1));
                postRepository.save(post);
            }
            
            return false; // Unliked
        } else {
            // Like
            like.setCreatedAt(new Date());
            likeRepository.save(like);
            
            // Update post like count
            Optional<Post> optionalPost = postRepository.findById(like.getPostId());
            if (optionalPost.isPresent()) {
                Post post = optionalPost.get();
                post.setLikesCount(post.getLikesCount() + 1);
                postRepository.save(post);
            }
            
            return true; // Liked
        }
    }

    public boolean checkIfUserLikedPost(String postId, String userId) {
        return likeRepository.existsByPostIdAndUserId(postId, userId);
    }

    public void deleteLikesByPostId(String postId) {
        likeRepository.deleteByPostId(postId);
    }
}
