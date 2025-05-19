package com.photoshare.api.service;

import com.photoshare.api.model.User;
import com.photoshare.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
//hi
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedAt(new Date());
        user.setUpdatedAt(new Date());
        return userRepository.save(user);
    }

    public User updateUser(String id, User userDetails) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setFullName(userDetails.getFullName());
            user.setBio(userDetails.getBio());
            user.setProfilePicture(userDetails.getProfilePicture());
            user.setInterests(userDetails.getInterests());
            user.setUpdatedAt(new Date());
            return userRepository.save(user);
        }
        return null;
    }
//delete user
    public boolean deleteUser(String id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<User> searchUsersByInterest(String interest) {
        return userRepository.findByInterests(interest);
    }

    public List<User> searchUsersByUsername(String username) {
        return userRepository.findByUsernameContaining(username);
    }

    public boolean followUser(String userId, String followId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        Optional<User> optionalFollowUser = userRepository.findById(followId);

        if (optionalUser.isPresent() && optionalFollowUser.isPresent()) {
            User user = optionalUser.get();
            User followUser = optionalFollowUser.get();

            if (!user.getFollowing().contains(followId)) {
                user.getFollowing().add(followId);
                followUser.getFollowers().add(userId);

                userRepository.save(user);
                userRepository.save(followUser);
                return true;
            }
        }
        return false;
    }

    public boolean unfollowUser(String userId, String unfollowId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        Optional<User> optionalUnfollowUser = userRepository.findById(unfollowId);

        if (optionalUser.isPresent() && optionalUnfollowUser.isPresent()) {
            User user = optionalUser.get();
            User unfollowUser = optionalUnfollowUser.get();

            if (user.getFollowing().contains(unfollowId)) {
                user.getFollowing().remove(unfollowId);
                unfollowUser.getFollowers().remove(userId);

                userRepository.save(user);
                userRepository.save(unfollowUser);
                return true;
            }
        }
        return false;
    }
}
