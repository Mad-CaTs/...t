package world.inclub.membershippayment.domain.Exceptions;

public class DuplicateCouponException extends RuntimeException {
    private final String code;

    public DuplicateCouponException(String message) {
        super(message);
        this.code = "Coupon_code_duplicate_ERROR";
    }

    public DuplicateCouponException(String message, String code) {
        super(message);
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}
