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
@Table(name = DatabaseConstants.ACCOUNTBANK_TABLE, schema = DatabaseConstants.SCHEMA_NAME)
public class AccountBank {

    @Id
    @Column("idaccountbank")
    private Long idAccountBank;
    @Column("idtypeaccountbank")
    private Integer idTypeAccountBank;
    @Column("idbank")
    private Integer idBank;
    @Column("iduser")
    private Integer idUser;
    private String holder;
    @Column("accountnumber")
    private String accountNumber;
    @Column("taxpayernumber")
    private String taxpayerNumber;
    @Column("companyname")
    private String companyName;
    @Column("fiscaladdress")
    private String fiscalAddress;
    
    private String cci;
    private Boolean status;
    @Column("bankaddress")
    private String bankAddress;
    private String swift;
    private String iban;
}