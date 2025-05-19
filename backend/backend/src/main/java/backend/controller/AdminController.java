package backend.controller;

import backend.model.AdminModel;
import backend.repostry.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminRepository adminRepository;

    // Admin login
    @PostMapping("/login")
    public ResponseEntity<?> loginAdmin(@RequestBody Map<String, String> credentials) {
        try {
            System.out.println("Admin login attempt with email: " + credentials.get("email"));
            
            String email = credentials.get("email");
            String password = credentials.get("password");

            if (email == null || password == null) {
                System.out.println("Admin login failed: Email or password is null");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Email and password are required"));
            }

            AdminModel admin = adminRepository.findByEmail(email);
            if (admin == null) {
                System.out.println("Admin login failed: No admin found with email: " + email);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid email or password"));
            }

            if (!admin.getPassword().equals(password)) {
                System.out.println("Admin login failed: Password mismatch for email: " + email);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid email or password"));
            }

            // Update last login time
            admin.setLastLogin(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            adminRepository.save(admin);

            Map<String, Object> response = new HashMap<>();
            response.put("id", admin.getId());
            response.put("email", admin.getEmail());
            response.put("name", admin.getName());
            response.put("role", admin.getRole());
            response.put("token", generateMockToken(admin));
            
            System.out.println("Admin login successful for: " + email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Admin login error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "An error occurred during login. Please try again later."));
        }
    }

    // Register new admin (only accessible to existing admins)
    @PostMapping("/register")
    public ResponseEntity<?> registerAdmin(@RequestBody AdminModel admin) {
        if (adminRepository.existsByEmail(admin.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Email already in use"));
        }

        admin.setLastLogin(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        AdminModel savedAdmin = adminRepository.save(admin);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAdmin);
    }

    // Get all admins
    @GetMapping
    public List<AdminModel> getAllAdmins() {
        return adminRepository.findAll();
    }

    // Get admin by id
    @GetMapping("/{id}")
    public ResponseEntity<Object> getAdminById(@PathVariable Long id) {
        return adminRepository.findById(id)
                .map(admin -> {
                    // Don't return password
                    admin.setPassword(null);
                    return ResponseEntity.ok().body((Object)admin);
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Admin not found")));
    }

    // Update admin
    @PutMapping("/{id}")
    public ResponseEntity<Object> updateAdmin(@PathVariable Long id, @RequestBody AdminModel adminDetails) {
        return adminRepository.findById(id)
                .map(admin -> {
                    if (adminDetails.getName() != null) {
                        admin.setName(adminDetails.getName());
                    }
                    if (adminDetails.getEmail() != null) {
                        admin.setEmail(adminDetails.getEmail());
                    }
                    if (adminDetails.getPassword() != null) {
                        admin.setPassword(adminDetails.getPassword());
                    }
                    if (adminDetails.getRole() != null) {
                        admin.setRole(adminDetails.getRole());
                    }
                    
                    AdminModel updatedAdmin = adminRepository.save(admin);
                    // Don't return password
                    updatedAdmin.setPassword(null);
                    return ResponseEntity.ok().body((Object)updatedAdmin);
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Admin not found")));
    }

    // Delete admin
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAdmin(@PathVariable Long id) {
        return adminRepository.findById(id)
                .map(admin -> {
                    adminRepository.delete(admin);
                    return ResponseEntity.ok(Map.of("message", "Admin deleted successfully"));
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Admin not found")));
    }

    // Helper method to generate a mock token (in a real app, use JWT or similar)
    private String generateMockToken(AdminModel admin) {
        // This is just a mock implementation
        // In a real application, use a proper JWT library
        return "mock-jwt-token-" + admin.getId() + "-" + System.currentTimeMillis();
    }
}
