package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import world.inclub.bonusesrewards.shared.infrastructure.auditing.BaseAuditableEntity;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

import static world.inclub.bonusesrewards.carbonus.infrastructure.persistence.schema.CarBonusSchema.SCHEMA;
import static world.inclub.bonusesrewards.carbonus.infrastructure.persistence.schema.CarBonusSchema.Table.CAR_ASSIGNMENT_TABLE;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Table(value = CAR_ASSIGNMENT_TABLE, schema = SCHEMA)
public class CarAssignmentEntity
        extends BaseAuditableEntity {

    @Id
    @Column("id")
    private UUID id;

    @Column("car_id")
    private UUID carId;

    @Column("quotation_id")
    private UUID quotationId;

    @Column("member_id")
    private Long memberId;

    @Column("price_usd")
    private BigDecimal price;

    @Column("interest_rate")
    private BigDecimal interestRate;

    @Column("rank_bonus_id")
    private UUID rankBonusId;

    @Column("member_initial_usd")
    private BigDecimal memberInitial;

    @Column("initial_installments_count")
    private Integer initialInstallmentsCount;

    @Column("monthly_installments_count")
    private Integer monthlyInstallmentsCount;

    @Column("payment_start_date")
    private LocalDate paymentStartDate;

    @Column("total_gps_usd")
    private BigDecimal totalGpsUsd;

    @Column("total_insurance_usd")
    private BigDecimal totalInsuranceUsd;

    @Column("total_mandatory_insurance_amount")
    private BigDecimal totalMandatoryInsuranceAmount;

    @Column("assigned_date")
    private Instant assignedDate;

    @Column("is_assigned")
    private Boolean isAssigned;

}