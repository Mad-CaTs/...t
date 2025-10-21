package world.inclub.wallet.bankAccountWithdrawal.application.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Arrays;
import java.util.Optional;

@Getter
@AllArgsConstructor
public enum BankStatus {
    RECIBIDO(1, "Recibido"),
    PRE_APROBADO(2, "Pre Aprobado"),
    PRE_RECHAZADO(3, "Pre Rechazado"),
    APROBADO(4, "Aprobado"),
    RECHAZADO(5, "Rechazado");

    private final int id;
    private final String descripcion;

    public static Optional<BankStatus> fromId(int id) {
        return Arrays.stream(values())
                .filter(status -> status.id == id)
                .findFirst();
    }

    public static Optional<BankStatus> fromDescripcion(String descripcion) {
        return Arrays.stream(values())
                .filter(status -> status.descripcion.equalsIgnoreCase(descripcion))
                .findFirst();
    }
}

