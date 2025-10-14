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

import java.time.Instant;
import java.util.UUID;

import static world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.schema.BonusSchema.SCHEMA;
import static world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.schema.BonusSchema.Table.CLASSIFICATION_TABLE;

@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(value = CLASSIFICATION_TABLE, schema = SCHEMA)
public class ClassificationEntity
        extends BaseAuditableEntity {
    @Id
    private UUID id;

    @Column("member_id")
    private Long memberId;

    @Column("rank_id")
    private Long rankId;

    @Column("achieved_points")
    private Long achievedPoints;

    @Column("required_points")
    private Long requiredPoints;

    @Column("requalification_cycles")
    private Integer requalificationCycles;

    @Column("classification_date")
    private Instant classificationDate;

    @Column("start_period_id")
    private Long startPeriodId;

    @Column("end_period_id")
    private Long endPeriodId;

    @Column("notification_status")
    private Boolean notificationStatus;
}