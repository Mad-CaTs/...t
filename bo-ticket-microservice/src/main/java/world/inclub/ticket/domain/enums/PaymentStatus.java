package world.inclub.ticket.domain.enums;

public enum PaymentStatus {
    PENDING,
    APPROVED,
    REJECTED,
    TEMPORAL_REJECTED, // Estado temporal para rechazos que se pueden modificar
    CANCELLED,
    EXPIRED
}
