package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import world.inclub.bonusesrewards.shared.infrastructure.auditing.BaseAuditableEntity;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import static world.inclub.bonusesrewards.carbonus.infrastructure.persistence.schema.CarBonusSchema.SCHEMA;
import static world.inclub.bonusesrewards.carbonus.infrastructure.persistence.schema.CarBonusSchema.Table.CAR_RANK_BONUS_TABLE;

@Data
@Builder(toBuilder = true)
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Table(name = CAR_RANK_BONUS_TABLE, schema = SCHEMA)
public class CarRankBonusEntity
        extends BaseAuditableEntity {

    @Id
    @Column("id")
    private UUID id;

    @Column("rank_id")
    private Long rankId;

    @Column("monthly_bonus")
    private BigDecimal monthlyBonus;

    @Column("initial_bonus")
    private BigDecimal initialBonus;

    @Column("bonus_price")
    private BigDecimal bonusPrice;

    @Column("issue_date")
    private Instant issueDate;

    @Column("expiration_date")
    private Instant expirationDate;

    @Column("status_id")
    private Long statusId;

}