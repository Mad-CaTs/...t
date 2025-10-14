package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity;

import lombok.*;
import world.inclub.bonusesrewards.shared.infrastructure.auditing.BaseAuditableEntity;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

import static world.inclub.bonusesrewards.carbonus.infrastructure.persistence.schema.CarBonusSchema.SCHEMA;
import static world.inclub.bonusesrewards.carbonus.infrastructure.persistence.schema.CarBonusSchema.Table.CAR_PAYMENT_SCHEDULE_TABLE;

@Data
@Builder(toBuilder = true)
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Table(name = CAR_PAYMENT_SCHEDULE_TABLE, schema = SCHEMA)
public class CarPaymentScheduleEntity
        extends BaseAuditableEntity {
    @Id
    @Column("id")
    private UUID id;

    @Column("car_assignment_id")
    private UUID carAssignmentId;

    @Column("order_num")
    private Integer orderNum;

    @Column("installment_num")
    private Integer installmentNum;

    @Column("is_initial")
    private Boolean isInitial;

    @Column("financing_installment_usd")
    private BigDecimal financingInstallmentUsd;

    @Column("insurance_usd")
    private BigDecimal insuranceUsd;

    @Column("initial_installment_usd")
    private BigDecimal initialInstallmentUsd;

    @Column("initial_bonus_usd")
    private BigDecimal initialBonusUsd;

    @Column("gps_usd")
    private BigDecimal gpsUsd;

    @Column("monthly_bonus_usd")
    private BigDecimal monthlyBonusUsd;

    @Column("member_assumed_payment_usd")
    private BigDecimal memberAssumedPaymentUsd;

    @Column("total_usd")
    private BigDecimal totalUsd;

    @Column("due_date")
    private LocalDate dueDate;

    @Column("status_id")
    private Long statusId;

    @Column("payment_date")
    private Instant paymentDate;

}
