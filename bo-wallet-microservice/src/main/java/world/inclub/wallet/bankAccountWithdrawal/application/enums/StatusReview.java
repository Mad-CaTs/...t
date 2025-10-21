package world.inclub.wallet.bankAccountWithdrawal.application.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Arrays;
import java.util.Optional;

@Getter
@AllArgsConstructor
public enum StatusReview {

    NOT_REVIEWED(1, "Sin Revisar"),
    VIEWED(2, "Visto"),
    NOT_NOTIFIED(3, "Sin Notificar"),
    NOTIFIED(4, "Notificado"),
    NOT_DOWNLADED(5, "Sin Descargar"),
    DOWNLOADED(6, "Descargado"),
    REVIEWED(7, "Revisar"),
    REJECTED(8, "Rechazar"),
    PRE_VALIDATED(9, "Pre Validar"),
    APPROVED(10, "Aprovado"),
    MODIFIED(11, "Modificado"),
    DOWNLOAD_EXCEL(12, "Descargar Excel"),
    DOWNLOAD_TXT(13, "Descargar Txt"),
    UPLOAD_TXT(14, "Subir Txt"),
    UPLOAD_EXCEL(15, "Subir Excel");


    private final int code;
    private final String description;

    public static Optional<StatusReview> fromId(int id) {
        return Arrays.stream(values())
                .filter(status -> status.code == id)
                .findFirst();
    }

    public static Optional<StatusReview> fromDescripcion(String descripcion) {
        return Arrays.stream(values())
                .filter(status -> status.description.equalsIgnoreCase(descripcion))
                .findFirst();
    }
}