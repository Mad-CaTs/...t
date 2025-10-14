package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.data.relational.core.mapping.Column;

import static world.inclub.bonusesrewards.carbonus.infrastructure.persistence.schema.CarBonusSchema.SCHEMA;
import static world.inclub.bonusesrewards.carbonus.infrastructure.persistence.schema.CarBonusSchema.Table.CAR_BRAND_TABLE;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = CAR_BRAND_TABLE, schema = SCHEMA)
public class CarBrandEntity {

    @Id
    @Column("id")
    private Long id;

    @Column("name")
    private String name;
    
}
