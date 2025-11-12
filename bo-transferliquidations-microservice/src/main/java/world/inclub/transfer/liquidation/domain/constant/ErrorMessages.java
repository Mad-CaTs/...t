package world.inclub.transfer.liquidation.domain.constant;

public class ErrorMessages {

    public static final String MALFORMED_JSON_REQUEST = "Malformed JSON request";
    public static final String WRITABLE_ERROR = "Error writing JSON output";
    public static final String METHOD_NOT_FOUND = "Could not find the %s method for URL %s";
    public static final String PARAMETER_INVALID = "Debes proporcionar al menos un parámetro válido";
    public static final String VALIDATION_MESSAGE = "Validation error. Check 'errors' field for details.";

    private ErrorMessages() {
        throw new AssertionError("ErrorMessages class should not be instantiated.");
    }


}
