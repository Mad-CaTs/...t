package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import static world.inclub.bonusesrewards.carbonus.infrastructure.persistence.schema.CarBonusSchema.SCHEMA;
import static world.inclub.bonusesrewards.carbonus.infrastructure.persistence.schema.CarBonusSchema.Table.CAR_BONUS_APPLICATION_TABLE;

@Data
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
@Table(name = CAR_BONUS_APPLICATION_TABLE, schema = SCHEMA)
public class CarBonusApplicationEntity {

    @Id
    @Column("id")
    private UUID id;

    @Column("car_assignment_id")
    private UUID carAssignmentId;

    @Column("payment_type_id")
    private Long paymentTypeId;

    @Column("bonus_amount")
    private BigDecimal bonusAmount;

    @Column("discount_amount")
    private BigDecimal discountAmount;

    @Column("applied_date")
    private Instant appliedDate;

}