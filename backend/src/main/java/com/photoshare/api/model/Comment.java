package com.photoshare.api.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Data
@Document(collection = "comments")
public class Comment {
    @Id
    private String id;
    private String postId;
    private String userId;
    private String username;
    private String content;
    private Date createdAt = new Date();
    private Date updatedAt = new Date();
    private String userProfilePic;
}
