package world.inclub.wallet.infraestructure.exception.core;

public class ExternalApiException extends RuntimeException {

    private final String details;

    public ExternalApiException(String message) {
        super(message);
        this.details = null;
    }

    public ExternalApiException(String message, String details) {
        super(message);
        this.details = details;
    }

    public ExternalApiException(String message, Throwable cause) {
        super(message, cause);
        this.details = null;
    }

    public ExternalApiException(String message, String details, Throwable cause) {
        super(message, cause);
        this.details = details;
    }

    public String getDetails() {
        return details;
    }
}