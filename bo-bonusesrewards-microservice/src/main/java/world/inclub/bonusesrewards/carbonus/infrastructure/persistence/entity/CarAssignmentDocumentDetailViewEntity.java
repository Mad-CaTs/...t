package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.Instant;
import java.util.UUID;

import static world.inclub.bonusesrewards.carbonus.infrastructure.persistence.schema.CarBonusSchema.SCHEMA;
import static world.inclub.bonusesrewards.carbonus.infrastructure.persistence.schema.CarBonusSchema.View.CAR_ASSIGNMENT_DOCUMENTS_DETAILS_VIEW;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(value = CAR_ASSIGNMENT_DOCUMENTS_DETAILS_VIEW, schema = SCHEMA)
public class CarAssignmentDocumentDetailViewEntity {

    @Id
    @Column("id")
    private UUID id;

    @Column("car_assignment_id")
    private UUID carAssignmentId;

    @Column("document_type_id")
    private Long documentTypeId;

    @Column("document_type_name")
    private String documentTypeName;

    @Column("file_name")
    private String fileName;

    @Column("file_url")
    private String fileUrl;

    @Column("file_size_bytes")
    private Long fileSizeBytes;

    @Column("created_at")
    private Instant createdAt;

    @Column("updated_at")
    private Instant updatedAt;

}
