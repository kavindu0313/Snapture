package backend.repostry;

import backend.model.PostModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<PostModel, Long> {
    PostModel findByPostId(String postId);
    List<PostModel> findByUserId(String userId);
    List<PostModel> findAllByOrderByCreatedAtDesc();
    
    // Find posts by type
    List<PostModel> findByPostTypeOrderByCreatedAtDesc(String postType);
    
    // Find posts by type and user
    List<PostModel> findByPostTypeAndUserIdOrderByCreatedAtDesc(String postType, String userId);
    
    // Find posts by template
    List<PostModel> findByTemplateOrderByCreatedAtDesc(String template);
}
