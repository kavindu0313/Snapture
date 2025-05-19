package backend.exception;

public class PostNotFoundException extends RuntimeException {
    public PostNotFoundException(Long id) {
        super("Could not find post with id " + id);
    }
    
    public PostNotFoundException(String postId) {
        super("Could not find post with postId " + postId);
    }
}
