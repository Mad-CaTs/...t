package world.inclub.appnotification.infraestructure.security.jwt;

public class KeolaSecurityException extends Exception{

    public KeolaSecurityException() {
    }

    public KeolaSecurityException(String message) {
        super(message);
    }

    public KeolaSecurityException(String message, Throwable cause) {
        super(message, cause);
    }
}
