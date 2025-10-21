package world.inclub.wallet.domain.entity;

import java.time.LocalDateTime;

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
@Table(name = DatabaseConstants.WACCOUNTBANK_TABLE, schema = DatabaseConstants.SCHEMA_NAME)
public class WithDrawalRequestAccountBank {

     @Id
    private Long id;
    @Column("idwallettransaction")
    private Integer idWalletTransaction;
    @Column("idaccountbank")
    private Integer idAccountBank;
    @Column("idrequeststates")
    private Integer idRequestStates;
    @Column("destinationcurrency")
    private Integer destinationCurrency;
    @Column("closingdate")
    private LocalDateTime closingDate;
    @Column("imagefile")
    private String imageFile;
    private  String description;


    public WithDrawalRequestAccountBank(Integer idWalletTransaction, Integer idAccountBank, Integer idRequestStates,
            Integer destinationCurrency, String imageFile,String description) {
        this.idWalletTransaction = idWalletTransaction;
        this.idAccountBank = idAccountBank;
        this.idRequestStates = idRequestStates;
        this.destinationCurrency = destinationCurrency;
        this.closingDate = LocalDateTime.now();
        this.imageFile = imageFile;
        this.description= description; 
    }

    

}
