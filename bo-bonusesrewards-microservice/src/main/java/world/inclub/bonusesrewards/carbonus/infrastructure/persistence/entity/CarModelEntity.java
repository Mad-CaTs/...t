package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import static world.inclub.bonusesrewards.carbonus.infrastructure.persistence.schema.CarBonusSchema.SCHEMA;
import static world.inclub.bonusesrewards.carbonus.infrastructure.persistence.schema.CarBonusSchema.Table.CAR_MODEL_TABLE;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = CAR_MODEL_TABLE, schema = SCHEMA)
public class CarModelEntity {

    @Id
    @Column("id")
    private Long id;

    @Column("name")
    private String name;

    @Column("brand_id")
    private Long brandId;
    
}
