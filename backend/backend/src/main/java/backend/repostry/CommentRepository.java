package backend.repostry;

import backend.model.CommentModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<CommentModel, Long> {
    CommentModel findByCommentId(String commentId);
    
    List<CommentModel> findByPostId(String postId);
    
    List<CommentModel> findByPostIdOrderByCreatedAtDesc(String postId);
    
    List<CommentModel> findByUserId(String userId);
    
    void deleteByCommentId(String commentId);
}
