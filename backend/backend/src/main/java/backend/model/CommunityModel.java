package backend.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;

@Entity
public class CommunityModel {
    @Id
    @GeneratedValue
    private Long id;
    
    private String communityId;
    private String name;
    
    @Column(length = 1000)
    private String description;
    
    private String creatorId;
    private String creatorName;
    private String coverImageUrl;
    private Date createdAt;
    private Date updatedAt;
    
    @ElementCollection
    private List<String> members = new ArrayList<>();
    
    @ElementCollection
    private List<String> moderators = new ArrayList<>();
    
    private int memberCount = 0;
    private int postCount = 0;
    
    @PrePersist
    protected void onCreate() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = new Date();
    }
    
    // Constructors
    public CommunityModel() {
    }
    
    public CommunityModel(String communityId, String name, String description, String creatorId, String creatorName) {
        this.communityId = communityId;
        this.name = name;
        this.description = description;
        this.creatorId = creatorId;
        this.creatorName = creatorName;
        this.members.add(creatorId); // Creator is automatically a member
        this.moderators.add(creatorId); // Creator is automatically a moderator
        this.memberCount = 1;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getCommunityId() {
        return communityId;
    }
    
    public void setCommunityId(String communityId) {
        this.communityId = communityId;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getCreatorId() {
        return creatorId;
    }
    
    public void setCreatorId(String creatorId) {
        this.creatorId = creatorId;
    }
    
    public String getCreatorName() {
        return creatorName;
    }
    
    public void setCreatorName(String creatorName) {
        this.creatorName = creatorName;
    }
    
    public String getCoverImageUrl() {
        return coverImageUrl;
    }
    
    public void setCoverImageUrl(String coverImageUrl) {
        this.coverImageUrl = coverImageUrl;
    }
    
    public Date getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
    
    public Date getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public List<String> getMembers() {
        return members;
    }
    
    public void setMembers(List<String> members) {
        this.members = members;
        this.memberCount = members.size();
    }
    
    public List<String> getModerators() {
        return moderators;
    }
    
    public void setModerators(List<String> moderators) {
        this.moderators = moderators;
    }
    
    public int getMemberCount() {
        return memberCount;
    }
    
    public void setMemberCount(int memberCount) {
        this.memberCount = memberCount;
    }
    
    public int getPostCount() {
        return postCount;
    }
    
    public void setPostCount(int postCount) {
        this.postCount = postCount;
    }
    
    // Helper methods
    public void addMember(String userId) {
        if (!this.members.contains(userId)) {
            this.members.add(userId);
            this.memberCount = this.members.size();
        }
    }
    
    public void removeMember(String userId) {
        // Don't remove the creator
        if (!userId.equals(this.creatorId) && this.members.contains(userId)) {
            this.members.remove(userId);
            this.memberCount = this.members.size();
            
            // Also remove from moderators if applicable
            if (this.moderators.contains(userId)) {
                this.moderators.remove(userId);
            }
        }
    }
    
    public void addModerator(String userId) {
        // Only add as moderator if they are a member
        if (this.members.contains(userId) && !this.moderators.contains(userId)) {
            this.moderators.add(userId);
        }
    }
    
    public void removeModerator(String userId) {
        // Don't remove the creator as moderator
        if (!userId.equals(this.creatorId) && this.moderators.contains(userId)) {
            this.moderators.remove(userId);
        }
    }
    
    public boolean isMember(String userId) {
        return this.members.contains(userId);
    }
    
    public boolean isModerator(String userId) {
        return this.moderators.contains(userId);
    }
    
    public void incrementPostCount() {
        this.postCount++;
    }
    
    public void decrementPostCount() {
        if (this.postCount > 0) {
            this.postCount--;
        }
    }
}
