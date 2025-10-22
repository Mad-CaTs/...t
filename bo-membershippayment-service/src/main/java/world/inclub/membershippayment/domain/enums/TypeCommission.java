package world.inclub.membershippayment.domain.enums;

public enum TypeCommission {


    COMMISSION_FIRST_MEMBERSHIP(1),
    COMMISSION_SECOND_MEMBERSHIP(2),
    COMMISSION_MIGRATION(3),
    COMMISSION_THIRD_MEMBERSHIP(4),
    COMMISSION_FEE_PAYMENT(5);

    private final int value;

    TypeCommission(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    public static TypeCommission fromValue(int value) {
        for (TypeCommission type : values()) {
            if (type.value == value) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown enum value: " + value);
    }
}
