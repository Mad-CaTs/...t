package world.inclub.transfer.liquidation.domain.enums;

public enum TransferStatus {
    PENDING(1),
    ACCEPTED(2),
    REJECTED(3),
    OBSERVED(4),
    REVERTED(5);

    private final int value;

    TransferStatus(int value) { this.value = value; }

    public int getValue() { return value; }

    public static TransferStatus fromValue(Integer v) {
        if (v == null) return null;
        for (TransferStatus s : values()) {
            if (s.value == v) return s;
        }
        return null;
    }
}
