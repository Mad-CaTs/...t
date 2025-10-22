package world.inclub.membershippayment.crosscutting.exception.core;

public class BusinessLogicException extends RuntimeException {

    private final String details;

    // Constructor con solo mensaje
    public BusinessLogicException(String message) {
        super(message);
        this.details = null;
    }

    // Constructor con mensaje y detalles
    public BusinessLogicException(String message, String details) {
        super(message);
        this.details = details;
    }

    // Constructor con mensaje y causa
    public BusinessLogicException(String message, Throwable cause) {
        super(message, cause);
        this.details = null;
    }

    // Constructor con mensaje, detalles y causa
    public BusinessLogicException(String message, String details, Throwable cause) {
        super(message, cause);
        this.details = details;
    }

    // Método para obtener detalles adicionales
    public String getDetails() {
        return details;
    }
}
