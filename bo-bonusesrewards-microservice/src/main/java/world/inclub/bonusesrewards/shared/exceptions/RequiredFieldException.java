package world.inclub.bonusesrewards.shared.exceptions;

public class RequiredFieldException
        extends RuntimeException {

    public RequiredFieldException(String message) {
        super(message);
    }

}