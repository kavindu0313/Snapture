package backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
public class LearningPlanModel {
    @Id
    @GeneratedValue
    private Long id;
    
    private String planId;
    private String title;
    private String description;
    private String userId;
    private String username;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int likes;
    private boolean isPublic = true;
    private String status = "In Progress"; // In Progress, Completed, Abandoned
    
    // Learning plan details
    private String goalDescription;
    private String targetCompletionDate;
    
    @ElementCollection
    @CollectionTable(name = "learning_plan_topics", joinColumns = @JoinColumn(name = "plan_id"))
    @Column(name = "topic")
    private List<String> topics = new ArrayList<>();
    
    @ElementCollection
    @CollectionTable(name = "learning_plan_resources", joinColumns = @JoinColumn(name = "plan_id"))
    private List<LearningResource> resources = new ArrayList<>();
    
    @ElementCollection
    @CollectionTable(name = "learning_plan_milestones", joinColumns = @JoinColumn(name = "plan_id"))
    private List<PlanMilestone> milestones = new ArrayList<>();
    
    public LearningPlanModel() {
        this.planId = UUID.randomUUID().toString();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public LearningPlanModel(String title, String description, String userId, String username) {
        this.planId = UUID.randomUUID().toString();
        this.title = title;
        this.description = description;
        this.userId = userId;
        this.username = username;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.likes = 0;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPlanId() {
        return planId;
    }

    public void setPlanId(String planId) {
        this.planId = planId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public int getLikes() {
        return likes;
    }

    public void setLikes(int likes) {
        this.likes = likes;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean isPublic) {
        this.isPublic = isPublic;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getGoalDescription() {
        return goalDescription;
    }

    public void setGoalDescription(String goalDescription) {
        this.goalDescription = goalDescription;
    }

    public String getTargetCompletionDate() {
        return targetCompletionDate;
    }

    public void setTargetCompletionDate(String targetCompletionDate) {
        this.targetCompletionDate = targetCompletionDate;
    }

    public List<String> getTopics() {
        return topics;
    }

    public void setTopics(List<String> topics) {
        this.topics = topics;
    }

    public List<LearningResource> getResources() {
        return resources;
    }

    public void setResources(List<LearningResource> resources) {
        this.resources = resources;
    }

    public List<PlanMilestone> getMilestones() {
        return milestones;
    }

    public void setMilestones(List<PlanMilestone> milestones) {
        this.milestones = milestones;
    }
    
    // Helper methods
    public void addTopic(String topic) {
        this.topics.add(topic);
    }
    
    public void removeTopic(String topic) {
        this.topics.remove(topic);
    }
    
    public void addResource(LearningResource resource) {
        this.resources.add(resource);
    }
    
    public void removeResource(LearningResource resource) {
        this.resources.remove(resource);
    }
    
    public void addMilestone(PlanMilestone milestone) {
        this.milestones.add(milestone);
    }
    
    public void removeMilestone(PlanMilestone milestone) {
        this.milestones.remove(milestone);
    }
    
    public void updateProgress() {
        // Calculate completion percentage based on milestones
        if (milestones.isEmpty()) {
            return;
        }
        
        long completedCount = milestones.stream()
                .filter(PlanMilestone::isCompleted)
                .count();
        
        if (completedCount == milestones.size()) {
            this.status = "Completed";
        } else if (completedCount > 0) {
            this.status = "In Progress";
        }
        
        this.updatedAt = LocalDateTime.now();
    }
}
