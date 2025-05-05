package com.photoshare.api.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String username;
    private String email;
    private String password;
    private String fullName;
    private String bio;
    private String profilePicture;
    private List<String> followers = new ArrayList<>();
    private List<String> following = new ArrayList<>();
    private List<String> interests = new ArrayList<>();
    private Date createdAt = new Date();
    private Date updatedAt = new Date();
    private List<String> roles = new ArrayList<>();
    private boolean enabled = true;
}
