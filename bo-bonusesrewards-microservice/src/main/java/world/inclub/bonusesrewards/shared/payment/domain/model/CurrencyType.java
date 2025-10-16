package world.inclub.bonusesrewards.shared.payment.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import world.inclub.bonusesrewards.shared.exceptions.InvalidStatusException;

import java.util.Arrays;

@Getter
@AllArgsConstructor
public enum CurrencyType {

    /**
     * Sol Peruano
     */
    PEN(1, "PEN", "S/"),

    /**
     * Dólar Estadounidense
     */
    USD(2, "USD", "$");

    private final Integer id;
    private final String code;
    private final String symbol;

    public static CurrencyType fromId(Integer id) {
        return Arrays.stream(values())
                .filter(type -> type.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new InvalidStatusException("Invalid CurrencyType ID: " + id));
    }

    public static CurrencyType fromCode(String code) {
        return Arrays.stream(values())
                .filter(type -> type.getCode().equals(code))
                .findFirst()
                .orElseThrow(() -> new InvalidStatusException("Invalid CurrencyType Code: " + code));
    }

    public static CurrencyType fromSymbol(String symbol) {
        return Arrays.stream(values())
                .filter(type -> type.getSymbol().equals(symbol))
                .findFirst()
                .orElseThrow(() -> new InvalidStatusException("Invalid CurrencyType Symbol: " + symbol));
    }
}
