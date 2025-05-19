package backend.repostry;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import backend.model.CommunityPostModel;

@Repository
public interface CommunityPostRepository extends JpaRepository<CommunityPostModel, Long> {
    Optional<CommunityPostModel> findByPostId(String postId);
    List<CommunityPostModel> findByCommunityId(String communityId);
    List<CommunityPostModel> findByAuthorId(String authorId);
    List<CommunityPostModel> findByCommunityIdOrderByCreatedAtDesc(String communityId);
    long countByCommunityId(String communityId);
}
