package world.inclub.bonusesrewards.shared.payment.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import world.inclub.bonusesrewards.shared.exceptions.InvalidStatusException;

import java.util.Arrays;

@Getter
@AllArgsConstructor
public enum PaymentType {
    /**
     * Banco de Crédito del Perú
     */
    BCP(1, "BCP"),

    /**
     * Interbank
     */
    INTERBANK(2, "INTERBANK"),

    /**
     * PayPal
     */
    PAYPAL(3, "PAYPAL"),

    /**
     * Wallet
     */
    WALLET(4, "WALLET"),

    /**
     * Other payment methods
     */
    OTHERS(5, "OTHERS");

    private final Integer id;
    private final String code;

    public static PaymentType fromId(Integer id) {
        return Arrays.stream(values())
                .filter(type -> type.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new InvalidStatusException("Invalid PaymentType ID: " + id));
    }

    public static PaymentType fromCode(String code) {
        return Arrays.stream(values())
                .filter(type -> type.getCode().equals(code))
                .findFirst()
                .orElseThrow(() -> new InvalidStatusException("Invalid PaymentType Code: " + code));
    }
}
