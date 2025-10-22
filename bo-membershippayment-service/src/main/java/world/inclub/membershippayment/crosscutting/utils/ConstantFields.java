package world.inclub.membershippayment.crosscutting.utils;

import lombok.Getter;

@Getter
public class ConstantFields {

    public static final String TOKEN_PREFIX="Bearer ";
    public static final String ACCOUNT_URL = "/";
    public static final String PANEL_ADMIN_URL = "https://adminpanelapi.inclub.world/api/";

    public static final class ErrorMessages {

        public static final String MALFORMED_JSON_REQUEST = "Malformed JSON request";
        public static final String WRITABLE_ERROR = "Error writing JSON output";
        public static final String METHOD_NOT_FOUND = "Could not find the %s method for URL %s";
        public static final String PARAMETER_INVALID = "Debes proporcionar al menos un parámetro válido";
        public static final String VALIDATION_MESSAGE = "Validation error. Check 'errors' field for details.";

        private ErrorMessages() {
            throw new AssertionError("ErrorMessages class should not be instantiated.");
        }
    }

    public static final class RegisterType {

        public static final Integer MULTI_ACCOUNT = 3;

        private RegisterType() {
            throw new AssertionError("RegisterType class should not be instantiated.");
        }
    }
}
