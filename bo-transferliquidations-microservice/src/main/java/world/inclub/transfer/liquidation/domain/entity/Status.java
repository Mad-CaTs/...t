package world.inclub.transfer.liquidation.domain.entity;

import java.sql.Timestamp;
import java.util.Date;

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
@Table(name = DatabaseConstants.STATUS, schema = DatabaseConstants.SCHEMA_NAME)
public class Status {

    @Id
    @Column("idstatus")
    private Long idStatus;
    
    @Column("description")
    private String description;
    
}