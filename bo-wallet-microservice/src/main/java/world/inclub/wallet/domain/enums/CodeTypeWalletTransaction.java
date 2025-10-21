package world.inclub.wallet.domain.enums;

public enum CodeTypeWalletTransaction {


    OBSERVACION(0,"Observation"),
    RETIRO(1, "Retiro"),
    PAGO_CUOTA(2, "Pago de Mi Cuota"),
    BONO_RECOMENDACION_DIRECTA(3, "Bono de Recomendación Directa"),
    BONIFICACION_RESIDUAL(4, "Bonificación Residual"),
    BONIFICACION_ARRANQUE_RAPIDO(5, "Bonificación de Arranque Rápido"),
    BONO_RESERVA(6, "Bono de Reserva"),
    BONIFICACION_EQUIPO(7, "Bonificación de Equipo"),
    BONO_PERIODO(8, "Bono del Período"),
    COMPRA_SERVICIOS_INTERNOS(9, "Compra de Servicios Internos"),
    PAGO_ADELANTO_CUOTAS(10, "Pago de Adelanto de Cuotas"),
    AMORTIZACION_CRONOGRAMA(11, "Amortización en Cronograma"),
    ENVIO_TRANSFERENCIA(12, "Envío de Transferencia"),
    RECEPCION_TRANSFERENCIA(13, "Recepción de Transferencia"),
    COMPRA_SUSCRIPCION_EXTRA(14, "Compra de Suscripción Adicional"),
    REGISTRO_SOCIO(15, "Registro de Socio"),
    UPGRADE_SUSCRIPCION(16, "Upgrade de Suscripción"),
    PRESTAMO_INCLUB(17, "Préstamo de Inclub"),
    DEVOLUCION_PRESTAMO(18, "Devolución de Préstamo de Inclub"),
    DESCUENTO_INCLUB(19, "Descuento de Inclub"),
    DEPOSITO_BASE_DATOS(20, "Depósito desde Base de Datos"),
    BONO_PAGO_CUOTA(21, "Bono de Pago de Cuota"),
    BONO_SEGUNDA_MEMBRESIA(22, "Bono de Segunda Membresía"),
    BONO_MIGRACION(23, "Bono de Migración"),
    ENVIO_TRANSFERENCIA_PAGO_DESPUES(24, "Envío de Transferencia para Usuario en Estado de Pago Después"),
    RECEPCION_TRANSFERENCIA_PAGO_DESPUES(25, "Recepción de Transferencia para Completar Pago de Registro"),
    DEVOLUCION_TRANSFERENCIA(26, "Devolución de Transferencia por Socio que No Terminó su Registro"),
    DEVOLUCION_SALDO(27, "Devolución de Saldo"),
    BONO_LOGRO_RANGO(28, "Bono de Logro de Rango"),
    MEMBRESIAS_EXTRAS(29, "Membresías Extras"),
    BONIFICACION_MARCAS_EXCLUSIVAS(30, "Bonificación por Compra en Marcas Exclusivas"),
    RETIRO_MARCAS_EXCLUSIVAS(31, "Retiro en Marcas Exclusivas"),
    //BONIFICACION_MARCAS_EXCLUSIVAS(32, "Bonificación por compra en Marcas Exclusivas"),
    //RETIRO_MARCAS_EXCLUSIVAS(33, "Retiro Marcas Exclusivas"),
    PAGO_BONO(34, "Pago de bono"),
    DEVOLUCION_PAGO_BONOS(35, "Devolución de pago de BONOS"),
    PAGO_LEGALIZACION(36, "Pago de legalización"),
    BONO_VIAJE(40, "Bono Viaje"),
    RECARGA_WALLET(41, "Recarga de Wallet"),
    COMPRA_ENTRADAS_EVENTOS(45, "Compra de entrada(s) para evento");


    private final int value;
    private final String description;

    CodeTypeWalletTransaction(int value, String description) {
        this.value = value;
        this.description = description;
    }

    public int getValue() {
        return value;
    }

    public String getDescription() {
        return description;
    }

    public static String getDescriptionByValue(int value) {
        for (CodeTypeWalletTransaction type : values()) {
            if (type.value == value) {
                return type.getDescription();
            }
        }
        throw new IllegalArgumentException("Unknown enum value: " + value);
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
