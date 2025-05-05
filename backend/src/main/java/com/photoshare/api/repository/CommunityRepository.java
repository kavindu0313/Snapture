package com.photoshare.api.repository;

import com.photoshare.api.model.Community;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommunityRepository extends MongoRepository<Community, String> {
    Optional<Community> findByName(String name);
    
    @Query("{'tags': {$in: [?0]}}")
    List<Community> findByTags(String tag);
    
    @Query("{'members': {$in: [?0]}}")
    List<Community> findByMemberId(String userId);
    
    @Query("{'name': {$regex: ?0, $options: 'i'}}")
    List<Community> findByNameContaining(String name);
    
    boolean existsByName(String name);
}
