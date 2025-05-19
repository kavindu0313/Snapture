package backend.repostry;

import backend.model.LearningPlanModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LearningPlanRepository extends JpaRepository<LearningPlanModel, Long> {
    LearningPlanModel findByPlanId(String planId);
    
    List<LearningPlanModel> findByUserId(String userId);
    
    List<LearningPlanModel> findByIsPublicTrue();
    
    List<LearningPlanModel> findByIsPublicTrueOrderByCreatedAtDesc();
    
    List<LearningPlanModel> findByUserIdOrderByCreatedAtDesc(String userId);
    
    List<LearningPlanModel> findByStatus(String status);
    
    List<LearningPlanModel> findByUserIdAndStatus(String userId, String status);
}
