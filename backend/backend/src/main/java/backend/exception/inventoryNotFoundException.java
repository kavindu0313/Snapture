package backend.exception;

public class inventoryNotFoundException extends RuntimeException {
    public inventoryNotFoundException(Long id ) {
        super("could not find id"+id);
    }
    public inventoryNotFoundException(String message) {
        super(message);
    }
}
