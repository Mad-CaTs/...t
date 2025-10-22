package world.inclub.membershippayment.domain.enums;

public enum TypePercentOverdue {

    ConCambioFecha(1),
    SinCambioFecha(2);

    private final int value;

    TypePercentOverdue(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

}
