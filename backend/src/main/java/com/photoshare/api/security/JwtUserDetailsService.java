package com.photoshare.api.security;

import com.photoshare.api.model.User;
import com.photoshare.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class JwtUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            
            List<SimpleGrantedAuthority> authorities = new ArrayList<>();
            if (user.getRoles() != null && !user.getRoles().isEmpty()) {
                authorities = user.getRoles().stream()
                    .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                    .collect(Collectors.toList());
            } else {
                authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
            }
            
            return new org.springframework.security.core.userdetails.User(
                user.getUsername(), 
                user.getPassword(), 
                user.isEnabled(), 
                true, 
                true, 
                true, 
                authorities
            );
        } else {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }
    }
}
