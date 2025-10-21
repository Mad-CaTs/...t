package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.Instant;
import java.util.UUID;

import static world.inclub.bonusesrewards.carbonus.infrastructure.persistence.schema.CarBonusSchema.SCHEMA;
import static world.inclub.bonusesrewards.carbonus.infrastructure.persistence.schema.CarBonusSchema.View.CAR_ASSIGNMENT_DOCUMENTS_SUMMARY_VIEW;

@Data
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
@Table(name = CAR_ASSIGNMENT_DOCUMENTS_SUMMARY_VIEW, schema = SCHEMA)
public class CarAssignmentDocumentSummaryViewEntity {

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

    @Column("car_color")
    private String carColor;

    @Column("member_rank_id")
    private Long memberRankId;

    @Column("last_document_updated_at")
    private Instant lastDocumentUpdatedAt;

    @Column("total_documents")
    private Integer totalDocuments;

}