package backend.repostry;

import backend.model.AdminModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<AdminModel, Long> {
    // Find admin by email
    AdminModel findByEmail(String email);
    
    // Check if admin exists by email
    boolean existsByEmail(String email);
}
