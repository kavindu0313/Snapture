package backend.controller;

import backend.exception.inventoryNotFoundException;
import backend.model.inventoryModel;
import backend.repostry.inventoryRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
public class inventoryController {

    @Autowired
    private inventoryRepository inventoryRepository;

    // Save new inventory item
    @PostMapping("/inventory")
    public inventoryModel newinventoryModel(@RequestBody inventoryModel newinventoryModel) {
        return inventoryRepository.save(newinventoryModel);
    }

    private final String UPLOAD_DIR = "uploads/";
    
    // Upload item image
    @PostMapping("/inventory/itemImg")
    public String itemImage(@RequestParam("file") MultipartFile file) {
        String itemImage = file.getOriginalFilename();

        try {
            // Create directory if it doesn't exist
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs(); // creates all missing parent directories
            }

            // Save the file using safe path concatenation
            file.transferTo(Paths.get(UPLOAD_DIR, itemImage));

        } catch (IOException e) {
            e.printStackTrace();
            return "Error uploading file: " + itemImage;
        }

        return itemImage;
    }

    @GetMapping("/inventory")
    List<inventoryModel> getAllItems() {return inventoryRepository.findAll();}

    @GetMapping("/inventory/{id}")
    inventoryModel getItemById(@PathVariable Long id) {
        return inventoryRepository.findById(id).orElseThrow(()->new inventoryNotFoundException(id));
    }
    
    @GetMapping("/inventory/item/{itemId}")
    public ResponseEntity<?> getItemByItemId(@PathVariable String itemId) {
        inventoryModel item = inventoryRepository.findByItemId(itemId);
        if (item == null) {
            return ResponseEntity.status(404).body("Item with ID " + itemId + " not found");
        }
        return ResponseEntity.ok(item);
    }

    // UPLOAD_DIR is now defined at the class level
    @GetMapping ("/uploads/{filename}")
    public ResponseEntity<FileSystemResource> getImage(@PathVariable String filename) {
        File file =new File(UPLOAD_DIR+filename);
        if(!file.exists()){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new FileSystemResource(file));
    }
    @PutMapping("/inventory/{itemId}")
    public ResponseEntity<?> updateItem(
            @RequestPart(value="itemDetails") String itemDetails,
            @RequestPart(value="file", required=false) MultipartFile file,
            @PathVariable String itemId
    ){
        System.out.println("Item Details: " + itemDetails);
        System.out.println("Updating item with ID: " + itemId);
        
        if(file != null){
            System.out.println("File is received: " + file.getOriginalFilename());
        } else {
            System.out.println("No file uploaded");
        }
        
        try {
            // Find the item by itemId
            inventoryModel existingInventory = inventoryRepository.findByItemId(itemId);
            if (existingInventory == null) {
                return ResponseEntity.status(404).body("Item with ID " + itemId + " not found");
            }
            
            ObjectMapper mapper = new ObjectMapper();
            inventoryModel newInventory;
            try {
                newInventory = mapper.readValue(itemDetails, inventoryModel.class);
                System.out.println("Successfully parsed item details: " + newInventory.getItemName());
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(400).body("Error parsing itemDetails: " + e.getMessage());
            }
            
            // Update the existing inventory with new values
            existingInventory.setItemId(newInventory.getItemId());
            existingInventory.setItemName(newInventory.getItemName());
            existingInventory.setItemCategory(newInventory.getItemCategory());
            existingInventory.setItemQty(newInventory.getItemQty());
            existingInventory.setItemDetails(newInventory.getItemDetails());
    
            if(file != null && !file.isEmpty()){
                String itemImage = file.getOriginalFilename();
    
                try{
                    // Create directory if it doesn't exist
                    File uploadDir = new File(UPLOAD_DIR);
                    if (!uploadDir.exists()) {
                        uploadDir.mkdirs();
                    }
                    
                    // Save the file using the same UPLOAD_DIR as other methods
                    file.transferTo(Paths.get(UPLOAD_DIR, itemImage));
                    
                    // Update the image name in the model
                    existingInventory.setItemImage(itemImage);
                    System.out.println("Updated image: " + itemImage);
                } catch (IOException e) {
                    e.printStackTrace();
                    return ResponseEntity.status(500).body("Error saving upload file: " + e.getMessage());
                }
            }
            
            inventoryModel savedItem = inventoryRepository.save(existingInventory);
            System.out.println("Item successfully updated: " + savedItem.getItemId());
            return ResponseEntity.ok(savedItem);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Unexpected error: " + e.getMessage());
        }
    }

    //Delete part
    @DeleteMapping("/inventory/{itemId}")
    String deleteItem(@PathVariable String itemId){
        //check item exists in db by itemId
        inventoryModel inventoryItem = inventoryRepository.findByItemId(itemId);
        
        if (inventoryItem == null) {
            throw new RuntimeException("Item with ID " + itemId + " not found");
        }
        
        //img delete part
        String itemImage = inventoryItem.getItemImage();
        if(itemImage != null && !itemImage.isEmpty()){
            // Use the same UPLOAD_DIR as other methods
            File imageFile = new File(UPLOAD_DIR + itemImage);
            if (imageFile.exists()) {
                if (imageFile.delete()){
                    System.out.println("Image deleted successfully");
                }else{
                    System.out.println("Image deletion failed");
                }
            }
        }
        
        //Delete Item from the repo
        inventoryRepository.delete(inventoryItem);
        return "Data with item ID " + itemId + " and associated image deleted";
    }
}
