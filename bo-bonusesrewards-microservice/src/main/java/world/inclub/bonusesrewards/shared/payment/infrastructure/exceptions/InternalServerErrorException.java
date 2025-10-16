package world.inclub.bonusesrewards.shared.payment.infrastructure.exceptions;

public class InternalServerErrorException extends RuntimeException {
    public InternalServerErrorException(String message) {
        super(message);
    }
}
