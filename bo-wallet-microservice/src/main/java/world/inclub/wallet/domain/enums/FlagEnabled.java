package world.inclub.wallet.domain.enums;

public enum FlagEnabled {

    Inactive(false),
    Active(true);

    private final boolean value;

    FlagEnabled(boolean value) {
        this.value = value;
    }

    public boolean getValue() {
        return value;
    }

    // Método adicional para obtener el enum a partir de un valor booleano
    public static FlagEnabled fromValue(boolean value) {
        for (FlagEnabled type : FlagEnabled.values()) {
            if (type.value == value) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown boolean value: " + value);
    }

}
