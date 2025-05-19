package backend.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class LearningResource {
    private String resourceName;
    private String resourceUrl;
    private String resourceType; // Book, Video, Course, Article, etc.
    private boolean completed;
    
    public LearningResource() {
    }
    
    public LearningResource(String resourceName, String resourceUrl, String resourceType) {
        this.resourceName = resourceName;
        this.resourceUrl = resourceUrl;
        this.resourceType = resourceType;
        this.completed = false;
    }
    
    public String getResourceName() {
        return resourceName;
    }
    
    public void setResourceName(String resourceName) {
        this.resourceName = resourceName;
    }
    
    public String getResourceUrl() {
        return resourceUrl;
    }
    
    public void setResourceUrl(String resourceUrl) {
        this.resourceUrl = resourceUrl;
    }
    
    public String getResourceType() {
        return resourceType;
    }
    
    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }
    
    public boolean isCompleted() {
        return completed;
    }
    
    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
}
