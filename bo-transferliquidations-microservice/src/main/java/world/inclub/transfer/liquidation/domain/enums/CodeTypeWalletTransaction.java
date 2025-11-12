package world.inclub.transfer.liquidation.domain.enums;

public enum CodeTypeWalletTransaction {

    
    Retiro (1),
    PagoCuota (2),
    BonoRecomendacionDirecta (3),
    BonificacionResidual (4),
    BonificacionArranqueRapido (5),
    BonoReserva (6),
    BonificacionEquipo (7),
    BonoPeriodo (8),
    CompraServiciosInternos (9),
    PagoAdelantoCuotas (10),
    AmortizacionCronograma (11),
    EnvioTransferencia (12),
    RecepcionTransferencia (13),
    CompraSuscripcionExtra (14),
    RegistroSocio (15),
    UpgradeSuscripcion (16),
    PrestamoInclub (17),
    DevolucionPrestamo (18),
    DescuentoInclub (19),
    DepositoBaseDatos (20),
    BonoPagoCuota (21),
    BonoSegundaMembresia (22),
    BonoMigracion (23),
    EnvioTransferenciaPagoDespues (24),
    RecepcionTransferenciaPagoDespues (25),
    DevolucionTransferencia (26),
    DevolucionSaldo (27),
    BonificacionMarcasExclusivas (30),
    RetiroMarcasExclusivas (31);
    
    private final int value;

    CodeTypeWalletTransaction(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    public static CodeTypeWalletTransaction fromValue(int value) {
        for (CodeTypeWalletTransaction type : values()) {
            if (type.value == value) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown enum value: " + value);
    }


}
