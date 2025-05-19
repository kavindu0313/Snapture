package backend.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class userModel {
    @Id
    @GeneratedValue

    private Long id;
    private String fullname;
    private String email;
    private String password;
    private String phone;
    
    @Column(length = 500)
    private String bio;
    
    private String profileImageUrl;
    
    @ElementCollection
    private List<String> followers = new ArrayList<>();
    
    @ElementCollection
    private List<String> following = new ArrayList<>();
    
    private int postCount = 0;
    private int followerCount = 0;
    private int followingCount = 0;

    public userModel() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public userModel(Long id, String fullname, String email, String password, String phone) {
        this.id = id;
        this.fullname = fullname;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.bio = "";
        this.profileImageUrl = "";
    }
    
    public String getBio() {
        return bio;
    }
    
    public void setBio(String bio) {
        this.bio = bio;
    }
    
    public String getProfileImageUrl() {
        return profileImageUrl;
    }
    
    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }
    
    public List<String> getFollowers() {
        return followers;
    }
    
    public void setFollowers(List<String> followers) {
        this.followers = followers;
        this.followerCount = followers.size();
    }
    
    public List<String> getFollowing() {
        return following;
    }
    
    public void setFollowing(List<String> following) {
        this.following = following;
        this.followingCount = following.size();
    }
    
    public void addFollower(String userId) {
        if (!this.followers.contains(userId)) {
            this.followers.add(userId);
            this.followerCount = this.followers.size();
        }
    }
    
    public void removeFollower(String userId) {
        this.followers.remove(userId);
        this.followerCount = this.followers.size();
    }
    
    public void addFollowing(String userId) {
        if (!this.following.contains(userId)) {
            this.following.add(userId);
            this.followingCount = this.following.size();
        }
    }
    
    public void removeFollowing(String userId) {
        this.following.remove(userId);
        this.followingCount = this.following.size();
    }
    
    public int getPostCount() {
        return postCount;
    }
    
    public void setPostCount(int postCount) {
        this.postCount = postCount;
    }
    
    public void incrementPostCount() {
        this.postCount++;
    }
    
    public void decrementPostCount() {
        if (this.postCount > 0) {
            this.postCount--;
        }
    }
    
    public int getFollowerCount() {
        return followerCount;
    }
    
    public int getFollowingCount() {
        return followingCount;
    }


}
