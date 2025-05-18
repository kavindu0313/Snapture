package com.photoshare.api.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Data
@Document(collection = "likes")
// @Document(collection = "likes")
public class Like {
    @Id
    private String id;
    private String postId;
    private String userId;
    private String username;
    private Date createdAt = new Date();
}
