package world.inclub.transfer.liquidation.domain.enums;

public enum TypeBalanceTransfer {

    Accounting(false),
    Available(true);

    private final boolean value;

    TypeBalanceTransfer(boolean value) {
        this.value = value;
    }

    public boolean getValue() {
        return value;
    }

    // Método adicional para obtener el enum a partir de un valor booleano
    public static TypeBalanceTransfer fromValue(boolean value) {
        for (TypeBalanceTransfer type : TypeBalanceTransfer.values()) {
            if (type.value == value) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown boolean value: " + value);
    }
}