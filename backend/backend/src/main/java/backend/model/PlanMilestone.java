package backend.model;

import jakarta.persistence.Embeddable;
import java.time.LocalDate;

@Embeddable
public class PlanMilestone {
    private String milestoneName;
    private String description;
    private String targetDate;
    private boolean completed;
    private String completedDate;
    
    public PlanMilestone() {
    }
    
    public PlanMilestone(String milestoneName, String description, String targetDate) {
        this.milestoneName = milestoneName;
        this.description = description;
        this.targetDate = targetDate;
        this.completed = false;
    }
    
    public String getMilestoneName() {
        return milestoneName;
    }
    
    public void setMilestoneName(String milestoneName) {
        this.milestoneName = milestoneName;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getTargetDate() {
        return targetDate;
    }
    
    public void setTargetDate(String targetDate) {
        this.targetDate = targetDate;
    }
    
    public boolean isCompleted() {
        return completed;
    }
    
    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
    
    public String getCompletedDate() {
        return completedDate;
    }
    
    public void setCompletedDate(String completedDate) {
        this.completedDate = completedDate;
    }
    
    public void markAsCompleted() {
        this.completed = true;
        this.completedDate = LocalDate.now().toString();
    }
}
