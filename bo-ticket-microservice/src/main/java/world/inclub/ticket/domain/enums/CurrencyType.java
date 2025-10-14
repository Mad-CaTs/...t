package world.inclub.ticket.domain.enums;

import lombok.Getter;

@Getter
public enum CurrencyType {
    USD("$"),
    PEN("S/");

    private final String symbol;

    CurrencyType(String symbol) {
        this.symbol = symbol;
    }

}