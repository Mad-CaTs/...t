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
@Table(name = DatabaseConstants.TRANSFER_REJECTION_TYPE, schema = DatabaseConstants.SCHEMA_NAME)
public class TransferRejectionType {

    @Id
    @Column("id_transfer_rejection_type")
    private Long id;

    @Column("name_transfer_rejection_type")
    private String name;

}
