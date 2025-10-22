package world.inclub.membershippayment.domain.enums;

public enum AplicateGracePeriod {
    NO_APLICA(0),
    Si_APLICA(1);

    private final int value;

    AplicateGracePeriod(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
