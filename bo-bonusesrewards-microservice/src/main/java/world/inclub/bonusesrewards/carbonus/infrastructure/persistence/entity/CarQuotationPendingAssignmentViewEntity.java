package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.util.UUID;

import static world.inclub.bonusesrewards.carbonus.infrastructure.persistence.schema.CarBonusSchema.SCHEMA;
import static world.inclub.bonusesrewards.carbonus.infrastructure.persistence.schema.CarBonusSchema.View.CAR_QUOTATION_PENDING_ASSIGNMENT_VIEW;

@Data
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
@Table(name = CAR_QUOTATION_PENDING_ASSIGNMENT_VIEW, schema = SCHEMA)
public class CarQuotationPendingAssignmentViewEntity {

    @Id
    @Column("quotation_id")
    private UUID quotationId;

    @Column("username")
    private String username;

    @Column("member_full_name")
    private String memberFullName;

    @Column("rank_id")
    private Long rankId;

}