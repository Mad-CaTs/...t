package world.inclub.transfer.liquidation.domain.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import world.inclub.transfer.liquidation.domain.constant.DatabaseConstants;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "transfer_observation_type", schema = DatabaseConstants.SCHEMA_NAME)
public class TransferObservationType {

    @Id
    @Column("id_transfer_observation_type")
    private Long id;

    @Column("name_transfer_observation_type")
    private String name;
}
