package backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.JoinColumn;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Entity
public class PostModel {
    @Id
    @GeneratedValue
    private Long id;
    private String postId;
    private String title;
    private String content;
    private String imageUrl;
    private String userId;
    private String username;
    private LocalDateTime createdAt;
    private int likes;
    private int commentCount = 0;
    
    // Learning progress specific fields
    private String postType = "regular"; // regular, learning_progress, learning_plan
    private String template; // template type used for learning progress
    
    // Fields for learning progress updates
    private String tutorialName;
    private String platform;
    
    @ElementCollection
    @CollectionTable(name = "post_skills", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "skill")
    private List<String> skillsLearned = new ArrayList<>();
    
    private String completionDate;
    private String proficiencyLevel;
    
    @ElementCollection
    @CollectionTable(name = "post_resources", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "resource")
    private List<String> learningResources = new ArrayList<>();
    
    private String practiceProjects;
    private String courseName;
    private String milestone;
    private String challengesFaced;
    private String nextSteps;

    public PostModel() {
    }

    public PostModel(Long id, String postId, String title, String content, String imageUrl, String userId, String username, LocalDateTime createdAt, int likes, String postType, String template) {
        this.id = id;
        this.postId = postId;
        this.title = title;
        this.content = content;
        this.imageUrl = imageUrl;
        this.userId = userId;
        this.username = username;
        this.createdAt = createdAt;
        this.likes = likes;
        this.commentCount = 0;
    }

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

    public int getLikes() {
        return likes;
    }

    public void setLikes(int likes) {
        this.likes = likes;
    }
    
    public String getPostType() {
        return postType;
    }

    public void setPostType(String postType) {
        this.postType = postType;
    }

    public String getTemplate() {
        return template;
    }

    public void setTemplate(String template) {
        this.template = template;
    }

    public String getTutorialName() {
        return tutorialName;
    }

    public void setTutorialName(String tutorialName) {
        this.tutorialName = tutorialName;
    }

    public String getPlatform() {
        return platform;
    }

    public void setPlatform(String platform) {
        this.platform = platform;
    }

    public List<String> getSkillsLearned() {
        return skillsLearned;
    }

    public void setSkillsLearned(List<String> skillsLearned) {
        this.skillsLearned = skillsLearned;
    }

    public String getCompletionDate() {
        return completionDate;
    }

    public void setCompletionDate(String completionDate) {
        this.completionDate = completionDate;
    }

    public String getProficiencyLevel() {
        return proficiencyLevel;
    }

    public void setProficiencyLevel(String proficiencyLevel) {
        this.proficiencyLevel = proficiencyLevel;
    }

    public List<String> getLearningResources() {
        return learningResources;
    }

    public void setLearningResources(List<String> learningResources) {
        this.learningResources = learningResources;
    }

    public String getPracticeProjects() {
        return practiceProjects;
    }

    public void setPracticeProjects(String practiceProjects) {
        this.practiceProjects = practiceProjects;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getMilestone() {
        return milestone;
    }

    public void setMilestone(String milestone) {
        this.milestone = milestone;
    }

    public String getChallengesFaced() {
        return challengesFaced;
    }

    public void setChallengesFaced(String challengesFaced) {
        this.challengesFaced = challengesFaced;
    }

    public String getNextSteps() {
        return nextSteps;
    }

    public void setNextSteps(String nextSteps) {
        this.nextSteps = nextSteps;
    }
    
    public int getCommentCount() {
        return commentCount;
    }
    
    public void setCommentCount(int commentCount) {
        this.commentCount = commentCount;
    }
}
