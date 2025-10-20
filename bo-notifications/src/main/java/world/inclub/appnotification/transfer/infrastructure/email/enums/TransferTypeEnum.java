package world.inclub.appnotification.transfer.infrastructure.email.enums;

import java.util.HashMap;
import java.util.Map;

public enum TransferTypeEnum {
    TYPE_1(1, "De cuenta normal a nuevo socio"),
    TYPE_2(2, "De cuenta multicódigo a nuevo socio"),
    TYPE_3(3, "De membresía a nuevo socio"),
    TYPE_4(4, "De membresía a socio vigente");

    private final int id;
    private final String label;

    TransferTypeEnum(int id, String label) {
        this.id = id;
        this.label = label;
    }

    public int getId() { return id; }
    public String getLabel() { return label; }

    private static final Map<Integer, TransferTypeEnum> BY_ID = new HashMap<>();
    static { for (TransferTypeEnum t : values()) BY_ID.put(t.id, t); }

    public static String labelOf(Integer id) {
        if (id == null) return "";
        TransferTypeEnum t = BY_ID.get(id);
        return t == null ? "" : t.label;
    }
}
