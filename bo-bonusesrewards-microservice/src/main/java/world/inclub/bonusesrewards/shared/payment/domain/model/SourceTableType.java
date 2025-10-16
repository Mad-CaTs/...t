package world.inclub.bonusesrewards.shared.payment.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import world.inclub.bonusesrewards.shared.exceptions.InvalidStatusException;

import java.util.Arrays;

@Getter
@AllArgsConstructor
public enum SourceTableType {

    /**
     * Payment from car payment schedules
     */
    CAR_PAYMENT_SCHEDULES(1, "CAR_PAYMENT_SCHEDULES", "car_payment_schedules");

    private final Integer id;
    private final String code;
    private final String tableName;

    public static SourceTableType fromId(Integer id) {
        return Arrays.stream(values())
                .filter(type -> type.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new InvalidStatusException("Invalid SourceTableType ID: " + id));
    }

    public static SourceTableType fromCode(String code) {
        return Arrays.stream(values())
                .filter(type -> type.getCode().equals(code))
                .findFirst()
                .orElseThrow(() -> new InvalidStatusException("Invalid SourceTableType Code: " + code));
    }

    public static SourceTableType fromTableName(String tableName) {
        return Arrays.stream(values())
                .filter(type -> type.getTableName().equals(tableName))
                .findFirst()
                .orElseThrow(() -> new InvalidStatusException("Invalid SourceTableType TableName: " + tableName));
    }
}
