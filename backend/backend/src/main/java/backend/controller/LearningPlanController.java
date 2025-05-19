package backend.controller;

import backend.model.LearningPlanModel;
import backend.model.LearningResource;
import backend.model.PlanMilestone;
import backend.repostry.LearningPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@CrossOrigin("http://localhost:3000")
public class LearningPlanController {

    @Autowired
    private LearningPlanRepository learningPlanRepository;

    // Create a new learning plan
    @PostMapping("/learning-plans")
    public LearningPlanModel createLearningPlan(@RequestBody LearningPlanModel learningPlanModel) {
        // Generate a unique planId if not provided
        if (learningPlanModel.getPlanId() == null || learningPlanModel.getPlanId().isEmpty()) {
            learningPlanModel.setPlanId(UUID.randomUUID().toString());
        }
        
        // Set creation and update times if not provided
        if (learningPlanModel.getCreatedAt() == null) {
            learningPlanModel.setCreatedAt(LocalDateTime.now());
        }
        
        if (learningPlanModel.getUpdatedAt() == null) {
            learningPlanModel.setUpdatedAt(LocalDateTime.now());
        }
        
        return learningPlanRepository.save(learningPlanModel);
    }
    
    // Get all public learning plans
    @GetMapping("/learning-plans")
    public List<LearningPlanModel> getAllPublicLearningPlans() {
        return learningPlanRepository.findByIsPublicTrueOrderByCreatedAtDesc();
    }
    
    // Get learning plan by ID
    @GetMapping("/learning-plans/{planId}")
    public ResponseEntity<?> getLearningPlanById(@PathVariable String planId) {
        LearningPlanModel plan = learningPlanRepository.findByPlanId(planId);
        if (plan == null) {
            return ResponseEntity.status(404).body("Learning plan with ID " + planId + " not found");
        }
        return ResponseEntity.ok(plan);
    }
    
    // Get learning plans by user ID
    @GetMapping("/learning-plans/user/{userId}")
    public List<LearningPlanModel> getLearningPlansByUserId(@PathVariable String userId) {
        return learningPlanRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    // Get learning plans by status
    @GetMapping("/learning-plans/status/{status}")
    public List<LearningPlanModel> getLearningPlansByStatus(@PathVariable String status) {
        return learningPlanRepository.findByStatus(status);
    }
    
    // Get user's learning plans by status
    @GetMapping("/learning-plans/user/{userId}/status/{status}")
    public List<LearningPlanModel> getUserLearningPlansByStatus(
            @PathVariable String userId,
            @PathVariable String status) {
        return learningPlanRepository.findByUserIdAndStatus(userId, status);
    }
    
    // Update learning plan
    @PutMapping("/learning-plans/{planId}")
    public ResponseEntity<?> updateLearningPlan(
            @RequestBody LearningPlanModel updatedPlan,
            @PathVariable String planId) {
        
        LearningPlanModel existingPlan = learningPlanRepository.findByPlanId(planId);
        if (existingPlan == null) {
            return ResponseEntity.status(404).body("Learning plan with ID " + planId + " not found");
        }
        
        // Update basic information
        existingPlan.setTitle(updatedPlan.getTitle());
        existingPlan.setDescription(updatedPlan.getDescription());
        existingPlan.setGoalDescription(updatedPlan.getGoalDescription());
        existingPlan.setTargetCompletionDate(updatedPlan.getTargetCompletionDate());
        existingPlan.setPublic(updatedPlan.isPublic());
        existingPlan.setStatus(updatedPlan.getStatus());
        
        // Update topics if provided
        if (updatedPlan.getTopics() != null && !updatedPlan.getTopics().isEmpty()) {
            existingPlan.setTopics(updatedPlan.getTopics());
        }
        
        // Update resources if provided
        if (updatedPlan.getResources() != null && !updatedPlan.getResources().isEmpty()) {
            existingPlan.setResources(updatedPlan.getResources());
        }
        
        // Update milestones if provided
        if (updatedPlan.getMilestones() != null && !updatedPlan.getMilestones().isEmpty()) {
            existingPlan.setMilestones(updatedPlan.getMilestones());
        }
        
        // Update progress based on milestones
        existingPlan.updateProgress();
        
        // Update the updatedAt timestamp
        existingPlan.setUpdatedAt(LocalDateTime.now());
        
        LearningPlanModel savedPlan = learningPlanRepository.save(existingPlan);
        return ResponseEntity.ok(savedPlan);
    }
    
    // Add a topic to a learning plan
    @PostMapping("/learning-plans/{planId}/topics")
    public ResponseEntity<?> addTopic(
            @PathVariable String planId,
            @RequestBody Map<String, String> payload) {
        
        LearningPlanModel plan = learningPlanRepository.findByPlanId(planId);
        if (plan == null) {
            return ResponseEntity.status(404).body("Learning plan with ID " + planId + " not found");
        }
        
        String topic = payload.get("topic");
        if (topic == null || topic.trim().isEmpty()) {
            return ResponseEntity.status(400).body("Topic cannot be empty");
        }
        
        plan.addTopic(topic);
        plan.setUpdatedAt(LocalDateTime.now());
        
        LearningPlanModel savedPlan = learningPlanRepository.save(plan);
        return ResponseEntity.ok(savedPlan);
    }
    
    // Remove a topic from a learning plan
    @DeleteMapping("/learning-plans/{planId}/topics/{topic}")
    public ResponseEntity<?> removeTopic(
            @PathVariable String planId,
            @PathVariable String topic) {
        
        LearningPlanModel plan = learningPlanRepository.findByPlanId(planId);
        if (plan == null) {
            return ResponseEntity.status(404).body("Learning plan with ID " + planId + " not found");
        }
        
        plan.removeTopic(topic);
        plan.setUpdatedAt(LocalDateTime.now());
        
        LearningPlanModel savedPlan = learningPlanRepository.save(plan);
        return ResponseEntity.ok(savedPlan);
    }
    
    // Add a resource to a learning plan
    @PostMapping("/learning-plans/{planId}/resources")
    public ResponseEntity<?> addResource(
            @PathVariable String planId,
            @RequestBody LearningResource resource) {
        
        LearningPlanModel plan = learningPlanRepository.findByPlanId(planId);
        if (plan == null) {
            return ResponseEntity.status(404).body("Learning plan with ID " + planId + " not found");
        }
        
        plan.addResource(resource);
        plan.setUpdatedAt(LocalDateTime.now());
        
        LearningPlanModel savedPlan = learningPlanRepository.save(plan);
        return ResponseEntity.ok(savedPlan);
    }
    
    // Update a resource's completion status
    @PutMapping("/learning-plans/{planId}/resources/{index}/complete")
    public ResponseEntity<?> updateResourceStatus(
            @PathVariable String planId,
            @PathVariable int index,
            @RequestBody Map<String, Boolean> payload) {
        
        LearningPlanModel plan = learningPlanRepository.findByPlanId(planId);
        if (plan == null) {
            return ResponseEntity.status(404).body("Learning plan with ID " + planId + " not found");
        }
        
        List<LearningResource> resources = plan.getResources();
        if (index < 0 || index >= resources.size()) {
            return ResponseEntity.status(400).body("Invalid resource index");
        }
        
        Boolean completed = payload.get("completed");
        if (completed != null) {
            resources.get(index).setCompleted(completed);
            plan.setUpdatedAt(LocalDateTime.now());
            
            // Update plan progress
            plan.updateProgress();
            
            LearningPlanModel savedPlan = learningPlanRepository.save(plan);
            return ResponseEntity.ok(savedPlan);
        }
        
        return ResponseEntity.status(400).body("Completed status not provided");
    }
    
    // Add a milestone to a learning plan
    @PostMapping("/learning-plans/{planId}/milestones")
    public ResponseEntity<?> addMilestone(
            @PathVariable String planId,
            @RequestBody PlanMilestone milestone) {
        
        LearningPlanModel plan = learningPlanRepository.findByPlanId(planId);
        if (plan == null) {
            return ResponseEntity.status(404).body("Learning plan with ID " + planId + " not found");
        }
        
        plan.addMilestone(milestone);
        plan.setUpdatedAt(LocalDateTime.now());
        
        LearningPlanModel savedPlan = learningPlanRepository.save(plan);
        return ResponseEntity.ok(savedPlan);
    }
    
    // Update a milestone's completion status
    @PutMapping("/learning-plans/{planId}/milestones/{index}/complete")
    public ResponseEntity<?> updateMilestoneStatus(
            @PathVariable String planId,
            @PathVariable int index,
            @RequestBody Map<String, Boolean> payload) {
        
        LearningPlanModel plan = learningPlanRepository.findByPlanId(planId);
        if (plan == null) {
            return ResponseEntity.status(404).body("Learning plan with ID " + planId + " not found");
        }
        
        List<PlanMilestone> milestones = plan.getMilestones();
        if (index < 0 || index >= milestones.size()) {
            return ResponseEntity.status(400).body("Invalid milestone index");
        }
        
        Boolean completed = payload.get("completed");
        if (completed != null) {
            if (completed) {
                milestones.get(index).markAsCompleted();
            } else {
                milestones.get(index).setCompleted(false);
                milestones.get(index).setCompletedDate(null);
            }
            
            plan.setUpdatedAt(LocalDateTime.now());
            
            // Update plan progress
            plan.updateProgress();
            
            LearningPlanModel savedPlan = learningPlanRepository.save(plan);
            return ResponseEntity.ok(savedPlan);
        }
        
        return ResponseEntity.status(400).body("Completed status not provided");
    }
    
    // Like a learning plan
    @PostMapping("/learning-plans/{planId}/like")
    public ResponseEntity<?> likeLearningPlan(@PathVariable String planId) {
        LearningPlanModel plan = learningPlanRepository.findByPlanId(planId);
        if (plan == null) {
            return ResponseEntity.status(404).body("Learning plan with ID " + planId + " not found");
        }
        
        plan.setLikes(plan.getLikes() + 1);
        learningPlanRepository.save(plan);
        return ResponseEntity.ok(plan);
    }
    
    // Delete a learning plan
    @DeleteMapping("/learning-plans/{planId}")
    public ResponseEntity<?> deleteLearningPlan(@PathVariable String planId) {
        LearningPlanModel plan = learningPlanRepository.findByPlanId(planId);
        if (plan == null) {
            return ResponseEntity.status(404).body("Learning plan with ID " + planId + " not found");
        }
        
        learningPlanRepository.delete(plan);
        return ResponseEntity.ok("Learning plan with ID " + planId + " deleted");
    }
}
