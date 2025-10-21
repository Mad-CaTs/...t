package world.inclub.wallet.domain.enums;


public enum State{

    Inactivo(0),

    Activo(1),

    PendienteValidacionInicial(2),

    RechazoInicial(3),

    PagarDespues(4),

    Deuda1(5),

    Deuda2(6),

    Deuda3(7),

    PreLiquidacion(8),

    Congelado(9),

    PendienteValidacionCuota(10),

    RechazoCuota(11),

    SuscripcionFinalizada(12),

    PendienteValidacionMigracion(13),

    RechazoMigracion(14),

    Liquidacion(15),

    PendienteValidacionCuotaAdelantada(16),

    Pendientevalidacionbono(17),

    PreRegistro(18);

    private final int value;

    State(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

}
