package com.photoshare.api.repository;

import com.photoshare.api.model.Like;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends MongoRepository<Like, String> {
    List<Like> findByPostId(String postId);
    List<Like> findByUserId(String userId);
    Optional<Like> findByPostIdAndUserId(String postId, String userId);
    void deleteByPostId(String postId);
    boolean existsByPostIdAndUserId(String postId, String userId);
}
