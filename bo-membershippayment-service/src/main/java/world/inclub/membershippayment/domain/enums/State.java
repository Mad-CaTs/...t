package world.inclub.membershippayment.domain.enums;

public enum State {
    INACTIVO(0),
    ACTIVO(1),
    PENDIENTE_VALIDACION_INICIAL(2),
    RECHAZO_INICIAL(3),
    PAGAR_DESPUES(4),
    DEUDA1(5),
    DEUDA2(6),
    DEUDA3(7),
    PRE_LIQUIDACION(8),
    CONGELADO(9),
    PENDIENTE_VALIDACION_CUOTA(10),
    RECHAZO_CUOTA(11),
    SUSCRIPCION_FINALIZADA(12),
    PENDIENTE_VALIDACION_MIGRACION(13),
    RECHAZO_MIGRACION(14),
    LIQUIDACION(15),
    PENDIENTE_VALIDACION_CUOTA_ADELANTADA(16),
    PENDIENTE_VALIDACION_BONO(17),
    PRE_REGISTRO(18),
    LIQUIDACION_ANUAL(19),

    SUSCRIPCION_FINALIZADA_1(20),
    SUSCRIPCION_FINALIZADA_2(21),
    SUSCRIPCION_FINALIZADA_3(22),
    SUSCRIPCION_FINALIZADA_4(23),
    SUSCRIPCION_FINALIZADA_5(24),
    SUSCRIPCION_FINALIZADA_6(25),

    DELETE_TEMPORAL(666);

    private final int value;

    State(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    public static String getNameByValue(int value) {
        for (State state : State.values()) {
            if (state.getValue() == value) {
                return state.name().replace("_", " "); // Reemplaza los guiones bajos por espacios
            }
        }
        throw new IllegalArgumentException("Invalid state value: " + value);
    }

    public static State fromValue(int value) {
        for (State type : values()) {
            if (type.value == value) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown enum value: " + value);
    }

}
