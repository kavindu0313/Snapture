package backend.repostry;

import backend.model.userModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface userRepository extends JpaRepository<userModel,Long> {
    // Change return type to Optional<userModel>
    java.util.Optional<userModel> findByEmail(String email);
}
