package com.photoshare.api.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Data
@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;
    private String userId;
    private String senderId;
    private String senderUsername;
    private String senderProfilePic;
    private String type; // like, comment, follow, community
    private String postId;
    private String communityId;
    private String message;
    private boolean read = false;
    private Date createdAt = new Date();
}
