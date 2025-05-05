package com.photoshare.api.controller;

import com.photoshare.api.model.User;
import com.photoshare.api.security.JwtTokenUtil;
import com.photoshare.api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody Map<String, String> request) throws Exception {
        String username = request.get("username");
        String password = request.get("password");
        
        authenticate(username, password);

        final UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        final String token = jwtTokenUtil.generateToken(userDetails);
        final String refreshToken = jwtTokenUtil.generateRefreshToken(userDetails);
        
        Optional<User> user = userService.getUserByUsername(username);
        
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("refreshToken", refreshToken);
        if (user.isPresent()) {
            User userData = user.get();
            userData.setPassword(null); // Don't send password back to client
            response.put("user", userData);
        }

        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        
        if (refreshToken == null) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Refresh token is required");
            return ResponseEntity.badRequest().body(response);
        }
        
        try {
            // Validate the refresh token
            String username = jwtTokenUtil.getUsernameFromToken(refreshToken);
            
            if (username == null || !jwtTokenUtil.isRefreshToken(refreshToken)) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Invalid refresh token");
                return ResponseEntity.badRequest().body(response);
            }
            
            final UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            
            if (!jwtTokenUtil.validateToken(refreshToken, userDetails)) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Refresh token has expired");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Generate new tokens
            final String newToken = jwtTokenUtil.generateToken(userDetails);
            final String newRefreshToken = jwtTokenUtil.generateRefreshToken(userDetails);
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", newToken);
            response.put("refreshToken", newRefreshToken);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error processing refresh token: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        // Check if username already exists
        if (userService.getUserByUsername(user.getUsername()).isPresent()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Username already exists");
            return ResponseEntity.badRequest().body(response);
        }
        
        // Set default values
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            user.setRoles(new ArrayList<>());
            user.getRoles().add("USER");
        }
        
        User savedUser = userService.createUser(user);
        savedUser.setPassword(null); // Don't send password back to client
        
        return ResponseEntity.ok(savedUser);
    }

    private void authenticate(String username, String password) throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (DisabledException e) {
            throw new Exception("USER_DISABLED", e);
        } catch (BadCredentialsException e) {
            throw new Exception("INVALID_CREDENTIALS", e);
        }
    }
}
