package world.inclub.bonusesrewards.shared.payment.infrastructure.exceptions;

public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String message) {
        super(message);
    }
}