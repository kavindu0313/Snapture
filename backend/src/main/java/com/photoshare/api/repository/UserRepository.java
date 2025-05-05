package com.photoshare.api.repository;

import com.photoshare.api.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    
    @Query("{'interests': {$in: [?0]}}")
    List<User> findByInterests(String interest);
    
    @Query("{'username': {$regex: ?0, $options: 'i'}}")
    List<User> findByUsernameContaining(String username);
}
