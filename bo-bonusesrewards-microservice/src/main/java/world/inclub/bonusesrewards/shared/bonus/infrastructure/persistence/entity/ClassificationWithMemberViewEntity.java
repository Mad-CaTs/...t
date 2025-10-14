package world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.Instant;
import java.util.UUID;

import static world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.schema.BonusSchema.SCHEMA;
import static world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.schema.BonusSchema.View.CLASSIFICATION_WITH_MEMBER_VIEW;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = CLASSIFICATION_WITH_MEMBER_VIEW, schema = SCHEMA)
public class ClassificationWithMemberViewEntity {

    @Id
    @Column("classification_id")
    private UUID classificationId;

    @Column("member_id")
    private Long memberId;

    @Column("username")
    private String username;

    @Column("member_full_name")
    private String fullName;

    @Column("country_id")
    private Long countryId;

    @Column("country_name")
    private String countryOfResidence;

    @Column("email")
    private String email;

    @Column("phone_number")
    private String phone;

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

    @Column("notification_status")
    private Boolean notificationStatus;

    @Column("start_period_id")
    private Long startPeriodId;

    @Column("end_period_id")
    private Long endPeriodId;

    @Column("created_at")
    private Instant createdAt;

    @Column("updated_at")
    private Instant updatedAt;

}