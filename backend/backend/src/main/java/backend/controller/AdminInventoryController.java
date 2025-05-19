package backend.controller;

import backend.model.inventoryModel;
import backend.repostry.inventoryRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/api/admin/inventory")
public class AdminInventoryController {

    @Autowired
    private inventoryRepository inventoryRepository;
    
    private final String UPLOAD_DIR = "uploads/";

    // Get all inventory items with pagination
    @GetMapping
    public ResponseEntity<?> getAllInventory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search
    ) {
        List<inventoryModel> items = inventoryRepository.findAll();
        
        // Filter by category if provided
        if (category != null && !category.isEmpty()) {
            items = items.stream()
                    .filter(item -> category.equals(item.getItemCategory()))
                    .collect(Collectors.toList());
        }
        
        // Filter by search term if provided
        if (search != null && !search.isEmpty()) {
            String searchLower = search.toLowerCase();
            items = items.stream()
                    .filter(item -> 
                            (item.getItemName() != null && item.getItemName().toLowerCase().contains(searchLower)) ||
                            (item.getItemDetails() != null && item.getItemDetails().toLowerCase().contains(searchLower)) ||
                            (item.getItemId() != null && item.getItemId().toLowerCase().contains(searchLower))
                    )
                    .collect(Collectors.toList());
        }
        
        // Calculate total and pages
        int total = items.size();
        int totalPages = (int) Math.ceil((double) total / size);
        
        // Apply pagination
        int fromIndex = page * size;
        int toIndex = Math.min(fromIndex + size, total);
        
        List<inventoryModel> pagedItems = fromIndex < total 
                ? items.subList(fromIndex, toIndex) 
                : List.of();
        
        Map<String, Object> response = new HashMap<>();
        response.put("items", pagedItems);
        response.put("currentPage", page);
        response.put("totalItems", total);
        response.put("totalPages", totalPages);
        
        return ResponseEntity.ok(response);
    }

    // Get inventory categories
    @GetMapping("/categories")
    public ResponseEntity<?> getCategories() {
        List<String> categories = inventoryRepository.findAll().stream()
                .map(inventoryModel::getItemCategory)
                .distinct()
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(categories);
    }

    // Create new inventory item
    @PostMapping
    public ResponseEntity<?> createInventoryItem(@RequestBody inventoryModel item) {
        // Check if itemId already exists
        if (inventoryRepository.findByItemId(item.getItemId()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Item with ID " + item.getItemId() + " already exists"));
        }
        
        inventoryModel savedItem = inventoryRepository.save(item);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedItem);
    }

    // Upload item image
    @PostMapping("/upload-image")
    public ResponseEntity<?> uploadItemImage(@RequestParam("file") MultipartFile file) {
        String itemImage = file.getOriginalFilename();

        try {
            // Create directory if it doesn't exist
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            // Save the file using safe path concatenation
            file.transferTo(Paths.get(UPLOAD_DIR, itemImage));

            return ResponseEntity.ok(Map.of("filename", itemImage));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error uploading file: " + e.getMessage()));
        }
    }

    // Update inventory item
    @PutMapping("/{itemId}")
    public ResponseEntity<?> updateInventoryItem(
            @PathVariable String itemId,
            @RequestBody inventoryModel itemDetails
    ) {
        inventoryModel existingItem = inventoryRepository.findByItemId(itemId);
        if (existingItem == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Item with ID " + itemId + " not found"));
        }
        
        // Update fields
        existingItem.setItemName(itemDetails.getItemName());
        existingItem.setItemCategory(itemDetails.getItemCategory());
        existingItem.setItemQty(itemDetails.getItemQty());
        existingItem.setItemDetails(itemDetails.getItemDetails());
        
        // Only update image if provided
        if (itemDetails.getItemImage() != null && !itemDetails.getItemImage().isEmpty()) {
            existingItem.setItemImage(itemDetails.getItemImage());
        }
        
        inventoryModel updatedItem = inventoryRepository.save(existingItem);
        return ResponseEntity.ok(updatedItem);
    }

    // Update inventory item with image
    @PutMapping("/{itemId}/with-image")
    public ResponseEntity<?> updateInventoryItemWithImage(
            @PathVariable String itemId,
            @RequestPart("itemDetails") String itemDetailsJson,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) {
        try {
            inventoryModel existingItem = inventoryRepository.findByItemId(itemId);
            if (existingItem == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Item with ID " + itemId + " not found"));
            }
            
            // Parse item details
            ObjectMapper mapper = new ObjectMapper();
            inventoryModel itemDetails = mapper.readValue(itemDetailsJson, inventoryModel.class);
            
            // Update fields
            existingItem.setItemName(itemDetails.getItemName());
            existingItem.setItemCategory(itemDetails.getItemCategory());
            existingItem.setItemQty(itemDetails.getItemQty());
            existingItem.setItemDetails(itemDetails.getItemDetails());
            
            // Handle file upload if provided
            if (file != null && !file.isEmpty()) {
                String itemImage = file.getOriginalFilename();
                
                // Create directory if it doesn't exist
                File uploadDir = new File(UPLOAD_DIR);
                if (!uploadDir.exists()) {
                    uploadDir.mkdirs();
                }
                
                // Save the file
                file.transferTo(Paths.get(UPLOAD_DIR, itemImage));
                
                // Update image name
                existingItem.setItemImage(itemImage);
            }
            
            inventoryModel updatedItem = inventoryRepository.save(existingItem);
            return ResponseEntity.ok(updatedItem);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error updating item: " + e.getMessage()));
        }
    }

    // Delete inventory item
    @DeleteMapping("/{itemId}")
    public ResponseEntity<?> deleteInventoryItem(@PathVariable String itemId) {
        inventoryModel item = inventoryRepository.findByItemId(itemId);
        if (item == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Item with ID " + itemId + " not found"));
        }
        
        // Delete associated image if exists
        String itemImage = item.getItemImage();
        if (itemImage != null && !itemImage.isEmpty()) {
            File imageFile = new File(UPLOAD_DIR + itemImage);
            if (imageFile.exists()) {
                if (imageFile.delete()) {
                    System.out.println("Image deleted successfully");
                } else {
                    System.out.println("Image deletion failed");
                }
            }
        }
        
        // Delete item
        inventoryRepository.delete(item);
        return ResponseEntity.ok(Map.of("message", "Item with ID " + itemId + " deleted successfully"));
    }

    // Bulk delete inventory items
    @DeleteMapping("/bulk")
    public ResponseEntity<?> bulkDeleteInventoryItems(@RequestBody List<String> itemIds) {
        int deletedCount = 0;
        
        for (String itemId : itemIds) {
            inventoryModel item = inventoryRepository.findByItemId(itemId);
            if (item != null) {
                // Delete associated image if exists
                String itemImage = item.getItemImage();
                if (itemImage != null && !itemImage.isEmpty()) {
                    File imageFile = new File(UPLOAD_DIR + itemImage);
                    if (imageFile.exists()) {
                        imageFile.delete();
                    }
                }
                
                // Delete item
                inventoryRepository.delete(item);
                deletedCount++;
            }
        }
        
        return ResponseEntity.ok(Map.of(
                "message", deletedCount + " items deleted successfully",
                "deletedCount", deletedCount
        ));
    }

    // Bulk update inventory items (e.g., for category changes)
    @PutMapping("/bulk")
    public ResponseEntity<?> bulkUpdateInventoryItems(
            @RequestBody Map<String, Object> updateData
    ) {
        try {
            @SuppressWarnings("unchecked")
            List<String> itemIds = (List<String>) updateData.get("itemIds");
            String field = (String) updateData.get("field");
            String value = (String) updateData.get("value");
            
            if (itemIds == null || field == null || value == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "itemIds, field, and value are required"));
            }
            
            int updatedCount = 0;
            
            for (String itemId : itemIds) {
                inventoryModel item = inventoryRepository.findByItemId(itemId);
                if (item != null) {
                    // Update the specified field
                    switch (field) {
                        case "itemCategory":
                            item.setItemCategory(value);
                            break;
                        case "itemQty":
                            item.setItemQty(value);
                            break;
                        default:
                            // Field not supported for bulk update
                            continue;
                    }
                    
                    inventoryRepository.save(item);
                    updatedCount++;
                }
            }
            
            return ResponseEntity.ok(Map.of(
                    "message", updatedCount + " items updated successfully",
                    "updatedCount", updatedCount
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error updating items: " + e.getMessage()));
        }
    }
}
