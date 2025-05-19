package backend.repostry;

import backend.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    // Find feedback by user ID
    List<Feedback> findByUserId(Long userId);
    
    // Find feedback by status
    List<Feedback> findByStatus(String status);
    
    // Find feedback by category
    List<Feedback> findByCategory(String category);
    
    // Find feedback with rating equal to or higher than specified value
    List<Feedback> findByRatingGreaterThanEqual(Integer rating);
    
    // Find feedback that has admin response
    List<Feedback> findByAdminResponseIsNotNull();
    
    // Find feedback that needs admin response
    List<Feedback> findByAdminResponseIsNull();
    
    // Count feedback by category
    Long countByCategory(String category);
    
    // Calculate average rating
    @Query("SELECT AVG(f.rating) FROM Feedback f")
    Double getAverageRating();
    
    // Calculate average rating by category
    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.category = :category")
    Double getAverageRatingByCategory(@Param("category") String category);
}
