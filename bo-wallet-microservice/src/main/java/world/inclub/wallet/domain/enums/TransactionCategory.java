package world.inclub.wallet.domain.enums;

public enum TransactionCategory {

    Ingreso(1),
    Egreso(2),
    Deuda(3),
    PagoDeuda(4);

    private final int value;

    TransactionCategory(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    public static TransactionCategory fromValue(int value) {
        for (TransactionCategory type : values()) {
            if (type.value == value) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown enum value: " + value);
    }


}
