package world.inclub.appnotification.transfer.infrastructure.email.enums;

import java.util.HashMap;
import java.util.Map;

public enum TransferObservationTypeEnum {
    OBS_1(1, "Documento ilegible"),
    OBS_2(2, "Otros");

    private final int id;
    private final String name;

    TransferObservationTypeEnum(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    private static final Map<Integer, TransferObservationTypeEnum> BY_ID = new HashMap<>();
    static {
        for (TransferObservationTypeEnum t : values())
            BY_ID.put(t.id, t);
    }

    public static String nameOf(Integer id) {
        if (id == null)
            return "";
        TransferObservationTypeEnum t = BY_ID.get(id);
        return t == null ? "" : t.name;
    }
}
