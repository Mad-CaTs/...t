package world.inclub.membershippayment.domain.Exceptions;

public class DomainValidationException extends RuntimeException{
    public DomainValidationException(String message) {
        super(message);
    }
}
