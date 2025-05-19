package backend.repostry;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import backend.model.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    List<Notification> findByUserId(String userId);
    
    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);
    
    List<Notification> findByUserIdAndIsReadFalseOrderByCreatedAtDesc(String userId);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.userId = ?1 AND n.isRead = false")
    long countUnreadByUserId(String userId);
    
    List<Notification> findByUserIdAndTypeOrderByCreatedAtDesc(String userId, String type);
    
    List<Notification> findByRelatedItemId(String relatedItemId);
}
