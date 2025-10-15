package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import world.inclub.bonusesrewards.shared.infrastructure.auditing.BaseAuditableEntity;

import java.util.UUID;

import static world.inclub.bonusesrewards.carbonus.infrastructure.persistence.schema.CarBonusSchema.SCHEMA;
import static world.inclub.bonusesrewards.carbonus.infrastructure.persistence.schema.CarBonusSchema.Table.CAR_TABLE;

@Data
@Builder(toBuilder = true)
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Table(name = CAR_TABLE, schema = SCHEMA)
public class CarEntity extends BaseAuditableEntity {

    @Id
    @Column("id")
    private UUID id;

    @Column("brand_id")
    private Long brandId;

    @Column("model_id")
    private Long modelId;

    @Column("color")
    private String color;

    @Column("image_url")
    private String imageUrl;

}
