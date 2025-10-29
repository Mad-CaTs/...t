package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import static world.inclub.bonusesrewards.carbonus.infrastructure.persistence.schema.CarBonusSchema.View.CAR_ASSIGNMENTS_ACTIVE_VIEW;
import static world.inclub.bonusesrewards.carbonus.infrastructure.persistence.schema.CarBonusSchema.SCHEMA;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(value = CAR_ASSIGNMENTS_ACTIVE_VIEW, schema = SCHEMA)
public class CarAssignmentsActiveViewEntity {

    @Id
    @Column("car_assignment_id")
    private UUID carAssignmentId;

    @Column("member_id")
    private Long memberId;

    @Column("username")
    private String username;

    @Column("member_full_name")
    private String memberFullName;

    @Column("brand_name")
    private String brandName;

    @Column("model_name")
    private String modelName;

    @Column("price_usd")
    private BigDecimal priceUsd;

    @Column("total_initial_installments")
    private Integer totalInitialInstallments;

    @Column("paid_initial_installments")
    private Long paidInitialInstallments;

    @Column("total_monthly_installments")
    private Integer totalMonthlyInstallments;

    @Column("paid_monthly_installments")
    private Long paidMonthlyInstallments;

    @Column("assigned_monthly_bonus_usd")
    private BigDecimal assignedMonthlyBonusUsd;

    @Column("monthly_installment_usd")
    private BigDecimal monthlyInstallmentUsd;

    @Column("rewarded_rank_id")
    private Long rewardedRankId;

    @Column("total_gps_usd")
    private BigDecimal totalGpsUsd;

    @Column("total_insurance_usd")
    private BigDecimal totalInsuranceUsd;

    @Column("total_mandatory_insurance_amount")
    private BigDecimal totalMandatoryInsuranceAmount;

    @Column("assigned_date")
    private Instant assignedDate;

}