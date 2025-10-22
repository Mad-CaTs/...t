package world.inclub.membershippayment.domain.enums;

public class ArraysData {
    public static final State[] StatesPaymentMade = {
            State.ACTIVO,
            State.PENDIENTE_VALIDACION_CUOTA,
            State.PENDIENTE_VALIDACION_INICIAL,
            State.PENDIENTE_VALIDACION_MIGRACION,
            State.PENDIENTE_VALIDACION_CUOTA_ADELANTADA
    };
}
