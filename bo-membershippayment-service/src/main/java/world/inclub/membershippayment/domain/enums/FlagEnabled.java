package world.inclub.membershippayment.domain.enums;

public enum FlagEnabled {

    INACTIVE(0),
    ACTIVE(1);
    private final int value;

    FlagEnabled(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
