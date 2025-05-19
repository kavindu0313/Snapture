package backend.exception;

public class AdminNotFoundException extends RuntimeException {
    public AdminNotFoundException(Long id) {
        super("Could not find admin with id: " + id);
    }
    
    public AdminNotFoundException(String email) {
        super("Could not find admin with email: " + email);
    }
}
