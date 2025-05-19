package backend.repostry;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import backend.model.CommunityModel;

@Repository
public interface CommunityRepository extends JpaRepository<CommunityModel, Long> {
    Optional<CommunityModel> findByCommunityId(String communityId);
    List<CommunityModel> findByMembersContaining(String userId);
    List<CommunityModel> findByNameContainingIgnoreCase(String keyword);
    boolean existsByCommunityId(String communityId);
    boolean existsByName(String name);
}
