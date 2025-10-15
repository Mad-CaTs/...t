package world.inclub.bonusesrewards.carbonus.domain.model;

import java.util.Arrays;

import lombok.AllArgsConstructor;
import lombok.Getter;
import world.inclub.bonusesrewards.shared.exceptions.InvalidStatusException;

@Getter
@AllArgsConstructor
public enum CarRankBonusStatus {
    
    /**
     * Bonus currently valid and available
     */
    ACTIVE(1L, "ACTIVE"),
    
    /**
     * Bonus expired due to time (expirationDate reached)
     */
    EXPIRED(2L, "EXPIRED"),
    
    /**
     * Bonus replaced by a new version (keep history)
     */
    SUPERSEDED(3L, "SUPERSEDED"),
    /**
     * Bonus cancelled by deletion (preserved for referential integrity)
     */
    CANCELLED(4L, "CANCELLED");

    private final Long id;
    private final String code;

    public static CarRankBonusStatus fromId(Long id) {
        return Arrays.stream(values())
                .filter(status -> status.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new InvalidStatusException("Invalid CarRankBonusStatus ID: " + id));
    }

    public static CarRankBonusStatus fromName(String code) {
        return Arrays.stream(values())
                .filter(status -> status.getCode().equals(code))
                .findFirst()
                .orElseThrow(() -> new InvalidStatusException("Invalid CarRankBonusStatus Name: " + code));
    }

}