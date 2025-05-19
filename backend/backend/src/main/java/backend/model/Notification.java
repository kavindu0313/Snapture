package backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Notification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String notificationId;
    private String userId;
    private String type; // like, comment, follow, mention, community
    private String content;
    private String relatedItemId; // postId, commentId, userId, communityId
    private boolean isRead;
    private boolean isViewed;
    private LocalDateTime createdAt;
    private String triggeredByUserId; // User who triggered the notification
    private String triggeredByUsername; // Username who triggered the notification
    
    public Notification() {
        this.isRead = false;
        this.isViewed = false;
        this.createdAt = LocalDateTime.now();
    }
    
    public Notification(String userId, String type, String content, String relatedItemId, 
                        String triggeredByUserId, String triggeredByUsername) {
        this.userId = userId;
        this.type = type;
        this.content = content;
        this.relatedItemId = relatedItemId;
        this.isRead = false;
        this.isViewed = false;
        this.createdAt = LocalDateTime.now();
        this.triggeredByUserId = triggeredByUserId;
        this.triggeredByUsername = triggeredByUsername;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNotificationId() {
        return notificationId;
    }

    public void setNotificationId(String notificationId) {
        this.notificationId = notificationId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getRelatedItemId() {
        return relatedItemId;
    }

    public void setRelatedItemId(String relatedItemId) {
        this.relatedItemId = relatedItemId;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean isRead) {
        this.isRead = isRead;
    }

    public boolean isViewed() {
        return isViewed;
    }

    public void setViewed(boolean isViewed) {
        this.isViewed = isViewed;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getTriggeredByUserId() {
        return triggeredByUserId;
    }

    public void setTriggeredByUserId(String triggeredByUserId) {
        this.triggeredByUserId = triggeredByUserId;
    }

    public String getTriggeredByUsername() {
        return triggeredByUsername;
    }

    public void setTriggeredByUsername(String triggeredByUsername) {
        this.triggeredByUsername = triggeredByUsername;
    }

    @Override
    public String toString() {
        return "Notification [notificationId=" + notificationId + ", userId=" + userId + ", type=" + type + ", content="
                + content + ", relatedItemId=" + relatedItemId + ", isRead=" + isRead + ", isViewed=" + isViewed
                + ", createdAt=" + createdAt + ", triggeredByUserId=" + triggeredByUserId + ", triggeredByUsername="
                + triggeredByUsername + "]";
    }
}
