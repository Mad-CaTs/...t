package world.inclub.transfer.liquidation.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import world.inclub.transfer.liquidation.domain.constant.DatabaseConstants;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = DatabaseConstants.OPTION_RETURN_MONEY, schema = DatabaseConstants.SCHEMA_NAME)
public class OptionReturnMoney {

    @Id
    @Column("idOptionReturnMoney")
    private Long idOptionReturnMoney;

    @Column("description")
    private String description;
    
}