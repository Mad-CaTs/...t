package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import world.inclub.bonusesrewards.shared.infrastructure.auditing.BaseAuditableEntity;

import java.util.UUID;

import static world.inclub.bonusesrewards.carbonus.infrastructure.persistence.schema.CarBonusSchema.SCHEMA;
import static world.inclub.bonusesrewards.carbonus.infrastructure.persistence.schema.CarBonusSchema.Table.CAR_ASSIGNMENT_DOCUMENT_TABLE;

@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = CAR_ASSIGNMENT_DOCUMENT_TABLE, schema = SCHEMA)
public class CarAssignmentDocumentEntity
        extends BaseAuditableEntity {

    @Id
    private UUID id;

    @Column("car_assignment_id")
    private UUID carAssignmentId;

    @Column("document_type_id")
    private Long documentTypeId;

    @Column("file_name")
    private String fileName;

    @Column("file_url")
    private String fileUrl;

    @Column("file_size_bytes")
    private Long fileSizeBytes;

}