package com.photoshare.api.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@Document(collection = "posts")
public class Post {
    @Id
    private String id;
    private String userId;
    private String username;
    private String caption;
    private String imageUrl;
    private List<String> tags = new ArrayList<>();
    private List<Like> likes = new ArrayList<>();
    private List<Comment> comments = new ArrayList<>();
    private String communityId;
    private Date createdAt = new Date();
    private Date updatedAt = new Date();
    private int likesCount = 0;
    private int commentsCount = 0;
    private String location;
}
