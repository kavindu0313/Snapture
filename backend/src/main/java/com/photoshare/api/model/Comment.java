package com.photoshare.api.model;
// This class represents a comment in the application, including details such as the content, user, and timestamps.
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Data
@Document(collection = "comments")
// The @Document annotation indicates that this class is a MongoDB document, and the collection name is "comments".
// The @Data annotation from Lombok generates getters, setters, equals, hashCode, and toString methods automatically.
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
