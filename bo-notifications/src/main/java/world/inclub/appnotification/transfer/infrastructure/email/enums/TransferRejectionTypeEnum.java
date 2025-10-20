package world.inclub.appnotification.transfer.infrastructure.email.enums;

import java.util.HashMap;
import java.util.Map;

public enum TransferRejectionTypeEnum {
    REJECTION_1(1, "Membresías del perfil están inactivas",
            "El perfil tiene membresías inactivas que impiden el traspaso."),
    REJECTION_2(2, "Información incorrecta", "Algún dato proporcionado es incorrecto."),
    REJECTION_3(3, "Revertir la solicitud de traspaso",
            "Se solicita la reversión del traspaso por parte del usuario o administración."),
    REJECTION_4(4, "Otros motivos", "Motivo de rechazo no especificado en las opciones anteriores.");

    private final int id;
    private final String name;
    private final String description;

    TransferRejectionTypeEnum(int id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    private static final Map<Integer, TransferRejectionTypeEnum> BY_ID = new HashMap<>();
    static {
        for (TransferRejectionTypeEnum t : values())
            BY_ID.put(t.id, t);
    }

    public static String nameOf(Integer id) {
        if (id == null)
            return "";
        TransferRejectionTypeEnum t = BY_ID.get(id);
        return t == null ? "" : t.name;
    }

    public static String descriptionOf(Integer id) {
        if (id == null)
            return "";
        TransferRejectionTypeEnum t = BY_ID.get(id);
        return t == null ? "" : t.description;
    }
}
