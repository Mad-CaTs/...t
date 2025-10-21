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
@Table(name = DatabaseConstants.TYPEWALLETTRANSACTION_TABLE, schema = DatabaseConstants.SCHEMA_NAME)
public class TypeWalletTransaction {

    @Id
    @Column("idtypewallettransaction")
    private Integer idTypeWalletTransaction;
    @Column("idtransactioncategory")
    private Integer idTransactionCategory;
    @Column("description")
    private String description;
    @Column("isactive")
    private Boolean isActive;
    @Column("istransferbalanceavailable")
    private Boolean isTransferBalanceAvailable;
    

}
