package world.inclub.wallet.domain.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import world.inclub.wallet.domain.constant.DatabaseConstants;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = DatabaseConstants.TRANSACTIONCATEGORY_TABLE, schema = DatabaseConstants.SCHEMA_NAME)
public class TransactionCategory {
    
    @Id
    @Column("idtransactioncategory")
    private Integer idTransactionCategory;
    @Column("name")
    private String name;

}
