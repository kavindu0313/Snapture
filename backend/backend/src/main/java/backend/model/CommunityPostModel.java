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
public class CommunityPostModel {
    @Id
    @GeneratedValue
    private Long id;
    
    private String postId;
    private String communityId;
    private String authorId;
    private String authorName;
    private String title;
    
    @Column(length = 5000)
    private String content;
    
    private String imageUrl;
    private Date createdAt;
    private Date updatedAt;
    
    @ElementCollection
    private List<String> likes = new ArrayList<>();
    
    private int likeCount = 0;
    private int commentCount = 0;
    
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
    public CommunityPostModel() {
    }
    
    public CommunityPostModel(String postId, String communityId, String authorId, String authorName, String title, String content) {
        this.postId = postId;
        this.communityId = communityId;
        this.authorId = authorId;
        this.authorName = authorName;
        this.title = title;
        this.content = content;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getPostId() {
        return postId;
    }
    
    public void setPostId(String postId) {
        this.postId = postId;
    }
    
    public String getCommunityId() {
        return communityId;
    }
    
    public void setCommunityId(String communityId) {
        this.communityId = communityId;
    }
    
    public String getAuthorId() {
        return authorId;
    }
    
    public void setAuthorId(String authorId) {
        this.authorId = authorId;
    }
    
    public String getAuthorName() {
        return authorName;
    }
    
    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
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
    
    public List<String> getLikes() {
        return likes;
    }
    
    public void setLikes(List<String> likes) {
        this.likes = likes;
        this.likeCount = likes.size();
    }
    
    public int getLikeCount() {
        return likeCount;
    }
    
    public void setLikeCount(int likeCount) {
        this.likeCount = likeCount;
    }
    
    public int getCommentCount() {
        return commentCount;
    }
    
    public void setCommentCount(int commentCount) {
        this.commentCount = commentCount;
    }
    
    // Helper methods
    public void addLike(String userId) {
        if (!this.likes.contains(userId)) {
            this.likes.add(userId);
            this.likeCount = this.likes.size();
        }
    }
    
    public void removeLike(String userId) {
        if (this.likes.contains(userId)) {
            this.likes.remove(userId);
            this.likeCount = this.likes.size();
        }
    }
    
    public boolean isLikedBy(String userId) {
        return this.likes.contains(userId);
    }
    
    public void incrementCommentCount() {
        this.commentCount++;
    }
    
    public void decrementCommentCount() {
        if (this.commentCount > 0) {
            this.commentCount--;
        }
    }
}
