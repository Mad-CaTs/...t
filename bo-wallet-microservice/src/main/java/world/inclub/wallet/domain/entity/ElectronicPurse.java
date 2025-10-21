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
@Table(name = DatabaseConstants.ELECTRONICPURSE_TABLE, schema = DatabaseConstants.SCHEMA_NAME)
public class ElectronicPurse {

    @Id
    @Column("idelectronicpurse")
    private Long idElectronicPurse;
    @Column("iduser")
    private Integer idUser;
    @Column("idelectronicpursecompany")
    private Integer idElectronicPurseCompany;
    @Column("holdername")
    private String holdeName;
    @Column("holderlastname")
    private String holderLastName;
    @Column("usernameaccount")
    private String userNameAccount;
    @Column("paidlink")
    private String paidlink;

    
    public ElectronicPurse(Integer idUser, Integer idElectronicPurseCompany, String holdeName, String holderLastName,
            String userNameAccount, String paidlink) {
        this.idUser = idUser;
        this.idElectronicPurseCompany = idElectronicPurseCompany;
        this.holdeName = holdeName;
        this.holderLastName = holderLastName;
        this.userNameAccount = userNameAccount;
        this.paidlink = paidlink;
    }

    

}
