package com.photoshare.api.repository;

import com.photoshare.api.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {
    List<Post> findByUserId(String userId);
    
    @Query("{'tags': {$in: [?0]}}")
    List<Post> findByTags(String tag);
    
    List<Post> findByCommunityId(String communityId);
    
    @Query("{'userId': {$in: ?0}}")
    Page<Post> findByUserIdIn(List<String> userIds, Pageable pageable);
    
    @Query("{'caption': {$regex: ?0, $options: 'i'}}")
    List<Post> findByCaptionContaining(String caption);
}
