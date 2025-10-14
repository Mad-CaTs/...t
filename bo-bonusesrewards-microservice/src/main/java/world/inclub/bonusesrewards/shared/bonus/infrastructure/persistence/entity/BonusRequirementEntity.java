package world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import world.inclub.bonusesrewards.shared.infrastructure.auditing.BaseAuditableEntity;

import java.util.UUID;

import static world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.schema.BonusSchema.SCHEMA;
import static world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.schema.BonusSchema.Table.BONUS_REQUIREMENT_TABLE;

@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(value = BONUS_REQUIREMENT_TABLE, schema = SCHEMA)
public class BonusRequirementEntity
        extends BaseAuditableEntity {
    @Id
    private UUID id;

    @Column("rank_id")
    private Long rankId;

    @Column("bonus_type_id")
    private Long bonusTypeId;

    @Column("option_number")
    private Integer optionNumber;

    private Integer cycles;

    @Column("direct_points")
    private Integer directPoints;
}