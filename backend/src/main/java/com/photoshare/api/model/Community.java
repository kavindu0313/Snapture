package com.photoshare.api.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@Document(collection = "communities")
public class Community {
    @Id
    private String id;
    private String name;
    private String description;
    private String creatorId;
    private String coverImage;
    private List<String> members = new ArrayList<>();
    private List<String> tags = new ArrayList<>();
    private Date createdAt = new Date();
    private Date updatedAt = new Date();
    private int memberCount = 0;
    private int postCount = 0;
}
