package backend.repostry;

import backend.model.inventoryModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface inventoryRepository extends JpaRepository<inventoryModel, Long> {
    // Add method to find by itemId
    inventoryModel findByItemId(String itemId);
}
