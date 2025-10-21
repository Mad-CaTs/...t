package world.inclub.wallet.domain.entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import world.inclub.wallet.domain.constant.DatabaseConstants;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = DatabaseConstants.AFILIATE_TABLE, schema = DatabaseConstants.SCHEMA_NAME)
public class AffiliatePay {

    @Id
    @Column("idaffiliatepay")
    private Long idAffiliatePay;

    @Column("idwallet")
    private Long idWallet;

    @Column("idsuscription")
    private Long idSuscription;

    @Column("idpackage")
    private Long idPackage;

    @Column("namepackage")
    private String namePackage;

    @Column("numberquotas")
    private Long numberQuotas;

    @Column("amount")
    private BigDecimal amount;

    @Column("idpackagedetail")
    private Long idPackageDetail;

    @Column("dateaffiliate")
    private LocalDateTime dateAffiliate;

    @Column("datedesaffiliate")
    private LocalDateTime dateDesAffiliate;

    @Column("idreason")
    private  Long idReason;

    @Column("status")
    private boolean status;

    public AffiliatePay(Long idWallet,
                        Long idSuscription,
                        LocalDateTime dateAfilation,
                        LocalDateTime dateDesafilation,
                        Long idReason,
                        boolean status) {
        this.idWallet = idWallet;
        this.idSuscription = idSuscription;
        this.dateAffiliate = dateAfilation;
        this.dateDesAffiliate = dateDesafilation;
        this.idReason = idReason;
        this.status = status;
    }

}
