package backend.controller;

import backend.model.*;
import backend.repostry.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    @Autowired
    private userRepository userRepository;
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private CommentRepository commentRepository;
    
    @Autowired
    private CommunityRepository communityRepository;
    
    @Autowired
    private LearningPlanRepository learningPlanRepository;
    
    @Autowired
    private inventoryRepository inventoryRepository;

    // Get dashboard statistics
    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // User statistics
        long totalUsers = userRepository.count();
        
        // Post statistics
        long totalPosts = postRepository.count();
        
        // Comment statistics
        long totalComments = commentRepository.count();
        
        // Community statistics
        long totalCommunities = communityRepository.count();
        
        // Learning plan statistics
        long totalLearningPlans = learningPlanRepository.count();
        
        // Inventory statistics
        long totalInventoryItems = inventoryRepository.count();
        
        // Compile all statistics
        stats.put("userCount", totalUsers);
        stats.put("postCount", totalPosts);
        stats.put("commentCount", totalComments);
        stats.put("communityCount", totalCommunities);
        stats.put("learningPlanCount", totalLearningPlans);
        stats.put("inventoryCount", totalInventoryItems);
        
        return ResponseEntity.ok(stats);
    }

    // Get recent users
    @GetMapping("/recent-users")
    public ResponseEntity<?> getRecentUsers() {
        List<userModel> recentUsers = userRepository.findAll().stream()
                .limit(5)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(recentUsers);
    }

    // Get recent posts
    @GetMapping("/recent-posts")
    public ResponseEntity<?> getRecentPosts() {
        List<PostModel> recentPosts = postRepository.findAll().stream()
                .limit(5)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(recentPosts);
    }

    // Get recent inventory items
    @GetMapping("/recent-inventory")
    public ResponseEntity<?> getRecentInventory() {
        List<inventoryModel> recentItems = inventoryRepository.findAll().stream()
                .limit(5)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(recentItems);
    }

    // Get inventory by category
    @GetMapping("/inventory-by-category")
    public ResponseEntity<?> getInventoryByCategory() {
        List<inventoryModel> allItems = inventoryRepository.findAll();
        
        Map<String, Long> categoryCounts = allItems.stream()
                .collect(Collectors.groupingBy(
                        inventoryModel::getItemCategory,
                        Collectors.counting()
                ));
        
        return ResponseEntity.ok(categoryCounts);
    }

    // Get low stock inventory items (quantity less than 10)
    @GetMapping("/low-stock-inventory")
    public ResponseEntity<?> getLowStockInventory() {
        List<inventoryModel> lowStockItems = inventoryRepository.findAll().stream()
                .filter(item -> {
                    try {
                        int qty = Integer.parseInt(item.getItemQty());
                        return qty < 10;
                    } catch (NumberFormatException e) {
                        return false;
                    }
                })
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(lowStockItems);
    }
}
