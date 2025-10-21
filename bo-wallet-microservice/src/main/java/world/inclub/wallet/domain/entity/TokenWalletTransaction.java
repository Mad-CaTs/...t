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
@Table(name = DatabaseConstants.TOKENWALLETTRANSACTION_TABLE, schema = DatabaseConstants.SCHEMA_NAME)
public class TokenWalletTransaction {

    @Id
    @Column("idtokenwallettransaction")
    private Long idTokenWalletTransaction; 
    @Column("idwallet")
    private Long idWallet;
    @Column("codetoken")
    private String codeToken;
    @Column("createdate")
    private LocalDateTime createDate;
    @Column("expirationdate")
    private LocalDateTime expirationDate;
    @Column("istokenvalid")
    private Boolean isTokenValid;


    public TokenWalletTransaction (Long idWallet,String codeToken){
        this.idWallet = idWallet;
        this.codeToken = codeToken;
        this.createDate = LocalDateTime.now();
        this.expirationDate = createDate.plusMinutes(15);
        this.isTokenValid = true;
    }
}



    



