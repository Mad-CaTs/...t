package world.inclub.membershippayment.domain.enums;

public enum Currency {

    Dolar(1),
    Sol(2),
    PesosColombianos(3);


    private final int value;

    Currency(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    public static Currency fromValue(int value) {
        for (Currency type : values()) {
            if (type.value == value) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown enum value: " + value);
    }


}