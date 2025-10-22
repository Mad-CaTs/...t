package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import static world.inclub.bonusesrewards.carbonus.infrastructure.persistence.schema.CarBonusSchema.SCHEMA;
import static world.inclub.bonusesrewards.carbonus.infrastructure.persistence.schema.CarBonusSchema.View.CAR_BONUS_APPLICATIONS_DETAIL_VIEW;

@Data
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
@Table(name = CAR_BONUS_APPLICATIONS_DETAIL_VIEW, schema = SCHEMA)
public class CarBonusApplicationDetailViewEntity {

    @Id
    @Column("bonus_application_id")
    private UUID bonusApplicationId;

    @Column("car_assignment_id")
    private UUID carAssignmentId;

    @Column("member_id")
    private Long memberId;

    @Column("username")
    private String username;

    @Column("member_full_name")
    private String memberFullName;

    @Column("bonus_amount")
    private BigDecimal bonusAmount;

    @Column("discount_amount")
    private BigDecimal discountAmount;

    @Column("description")
    private String description;

    @Column("payment_type_id")
    private Long paymentTypeId;

    @Column("payment_type_code")
    private String paymentTypeCode;

    @Column("is_initial")
    private Boolean isInitial;

    @Column("applied_date")
    private Instant appliedDate;

}