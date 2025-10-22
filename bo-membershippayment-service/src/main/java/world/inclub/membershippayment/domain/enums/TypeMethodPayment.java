package world.inclub.membershippayment.domain.enums;

import lombok.Getter;

import java.util.HashMap;
import java.util.Map;

@Getter
public enum TypeMethodPayment {
    MIXTO(1),
    VOUCHERS(2),
    PAYPAL(3),
    WALLET(4),
    OTROS(5);


    private final int value;

    TypeMethodPayment(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    private static final Map<Integer, TypeMethodPayment> lookup = new HashMap<>();

    static {
        for (TypeMethodPayment type : TypeMethodPayment.values()) {
            lookup.put(type.getValue(), type);
        }
    }

    public static TypeMethodPayment fromValue(int value) {
        return lookup.get(value);
    }
}