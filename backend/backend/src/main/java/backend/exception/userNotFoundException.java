package backend.exception;

public class userNotFoundException extends RuntimeException {

    public userNotFoundException(Long id) {

        super("User with id " + id + " not found");
    }
    public userNotFoundException(String message) {
        super(message);
    }
}
