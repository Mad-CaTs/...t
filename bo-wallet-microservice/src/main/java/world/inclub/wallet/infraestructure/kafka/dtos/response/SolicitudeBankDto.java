package world.inclub.wallet.infraestructure.kafka.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import world.inclub.wallet.domain.constant.DatabaseConstants;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = DatabaseConstants.SOLICITUDACCOUNTBANK_TABLE, schema = DatabaseConstants.SCHEMA_NAME)
public class SolicitudeBankDto {
    @Id
    @Column("idsolicitudebank")
    private Long idsolicitudebank;

    @Column("iduser")
    private Integer idUser;

    @Column("idwallet")
    private Integer idWallet;

    @Column("idcountry")
    private Integer idCountry;

    @Column("idcurrency")
    private Integer idCurrency;

    @Column("idaccountbank")
    private Integer idAccountBank;

    @Column("idbankstatus")
    private Integer idBankStatus;

    @Transient
    private String nameCountry;
    @Transient
    private String bankAddress;
    @Transient
    private String codeSwift;
    @Transient
    private String codeIban;
    @Transient
    private String numberAccount;
    @Transient
    private String cci;
    @Transient
    private Long idTypeAccountBank;
    @Transient
    private String nameTypeAccountBank;
    @Transient
    private String nameHolder;
    @Transient
    private String numberContribuyente;
    @Transient
    private String razonSocial;
    @Transient
    private String addressFiscal;
    @Transient
    private Long idBank;
    @Transient
    private String nameBank;
    @Transient
    private Integer currencyIdBank;
    @Transient
    private String lastNameHolder;
    @Transient
    private String email;
    @Transient
    private Long idDocumentType;
    @Transient
    private String numDocument;
    @Transient
    private  Boolean titular;

    @Transient
    private String nameOrigen;

    @Transient
    private String lastNameOrigen;

    @Transient
    private  String usernameOrigen;
    @Column("money")
    private BigDecimal money;

    @Column("fechsolicitud")
    private LocalDateTime fechSolicitud;

    @Column("status")
    private Integer status;

    @Column("fechprocess")
    private LocalDateTime fechProcess;

    @Column("review_status_id")
    private Integer reviewStatusId;

    @Column("review_status_description")
    private String reviewStatusDescription;


}
