package backend.exception;

public class LearningPlanNotFoundException extends RuntimeException {
    public LearningPlanNotFoundException(Long id) {
        super("Could not find learning plan with id: " + id);
    }
    
    public LearningPlanNotFoundException(String planId) {
        super("Could not find learning plan with planId: " + planId);
    }
}
