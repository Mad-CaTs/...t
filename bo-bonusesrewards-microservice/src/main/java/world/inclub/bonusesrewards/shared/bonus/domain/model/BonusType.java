package world.inclub.bonusesrewards.shared.bonus.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum BonusType {
    /**
     * Bonus for car-related rewards
     */
    CAR(1L, "CAR"),

    /**
     * Bonus for travel-related rewards
     */
    TRAVEL(2L, "TRAVEL"),

    /**
     * Bonus for property-related rewards
     */
    PROPERTY(3L, "PROPERTY");

    private final Long id;
    private final String code;

    public static BonusType fromId(Long id) {
        return switch (id.intValue()) {
            case 1 -> CAR;
            case 2 -> TRAVEL;
            case 3 -> PROPERTY;
            default -> throw new IllegalArgumentException("Invalid BonusType ID: " + id);
        };
    }

    public static BonusType fromName(String code) {
        return switch (code) {
            case "CAR" -> CAR;
            case "TRAVEL" -> TRAVEL;
            case "PROPERTY" -> PROPERTY;
            default -> throw new IllegalArgumentException("Invalid BonusType Name: " + code);
        };
    }

}
