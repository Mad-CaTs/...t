package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

import static world.inclub.bonusesrewards.carbonus.infrastructure.persistence.schema.CarBonusSchema.SCHEMA;
import static world.inclub.bonusesrewards.carbonus.infrastructure.persistence.schema.CarBonusSchema.View.CAR_ASSIGNMENT_DETAIL_VIEW;

@Data
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
@Table(name = CAR_ASSIGNMENT_DETAIL_VIEW, schema = SCHEMA)
public class CarAssignmentDetailsViewEntity {

    @Id
    @Column("assignment_id")
    private UUID assignmentId;

    @Column("car_id")
    private UUID carId;

    // Car fields
    @Column("brand_id")
    private Long brandId;

    @Column("brand_name")
    private String brandName;

    @Column("model_id")
    private Long modelId;

    @Column("model_name")
    private String modelName;

    @Column("model_brand_id")
    private Long modelBrandId;

    @Column("color")
    private String color;

    @Column("image_url")
    private String imageUrl;

    // Assignment fields
    @Column("member_id")
    private Long memberId;

    @Column("price_usd")
    private BigDecimal priceUsd;

    @Column("interest_rate")
    private BigDecimal interestRate;

    @Column("rank_bonus_id")
    private UUID rankBonusId;

    @Column("bonus_initial_usd")
    private BigDecimal bonusInitialUsd;

    @Column("member_initial_usd")
    private BigDecimal memberInitialUsd;

    @Column("initial_installments_count")
    private Integer initialInstallmentsCount;

    @Column("monthly_installments_count")
    private Integer monthlyInstallmentsCount;

    @Column("payment_start_date")
    private LocalDate paymentStartDate;

    @Column("assigned_date")
    private Instant assignedDate;

    @Column("is_assigned")
    private Boolean isAssigned;
}