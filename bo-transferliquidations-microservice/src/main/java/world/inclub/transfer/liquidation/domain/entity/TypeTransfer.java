package world.inclub.transfer.liquidation.domain.entity;

import java.sql.Timestamp;

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
@Table(name = DatabaseConstants.TYPE_TRANSFER, schema = DatabaseConstants.SCHEMA_NAME)
public class TypeTransfer {

    @Id
    @Column("id_transfer_type")
    private Long idTypeTransfer;

    @Column("name_transfer_type")
    private String name;

    @Column("description_transfer_type")
    private String description;

    @Column("icon_transfer_type")
    private String icon;
    
}