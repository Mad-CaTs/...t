package world.inclub.wallet.domain.enums;

public enum CodeRequestStates {

    Enviado(1),
    Aprobado(2),
    Rechazo(3);
   

    private final int value;

    CodeRequestStates(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    public static CodeRequestStates fromValue(int value) {
        for (CodeRequestStates type : values()) {
            if (type.value == value) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown enum value: " + value);
    }



}
