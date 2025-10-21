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
@Table(name = DatabaseConstants.WELECTRONICPURSE_TABLE, schema = DatabaseConstants.SCHEMA_NAME)
public class WithDrawalRequestElectronicPurse {
    
    @Id
    private Long id;
    @Column("idwallettransaction")
    private Integer idWalletTransaction;
    @Column("idelectronicpurse")
    private Integer idElectronicPurse;
    @Column("idrequeststates")
    private Integer idRequestStates;
    @Column("destinationcurrency")
    private Integer destinationCurrency;
    @Column("closingdate")
    private LocalDateTime closingDate;
    @Column("imagefile")
    private String imageFile;
    private  String description;

    public WithDrawalRequestElectronicPurse(Integer idWalletTransaction, Integer idElectronicPurse,
            Integer idRequestStates, Integer destinationCurrency, String imagenFile, String description) {
        this.idWalletTransaction = idWalletTransaction;
        this.idElectronicPurse = idElectronicPurse;
        this.idRequestStates = idRequestStates;
        this.destinationCurrency = destinationCurrency;
        this.closingDate = LocalDateTime.now();
        this.imageFile = imagenFile;
        this.description = description;
    }

    

}
