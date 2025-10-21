package world.inclub.wallet.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
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
@Builder
@Table(name = DatabaseConstants.SOLICITUDACCOUNTBANK_TABLE, schema = DatabaseConstants.SCHEMA_NAME)
public class Solicitudebank {
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

    @Column("money")
    private BigDecimal money;

    @Column("fechsolicitud")
    private LocalDateTime fechSolicitud;

    @Column("status")
    private Integer status;

    @Column("fechprocess")
    private LocalDateTime fechProcess;

    @Column("idbankstatus")
    private Integer idBankStatus;

    @Column("review_status_id")
    private Integer review_status_id;

    @Column("updateReview_date")
    private LocalDateTime reviewDateUpdate;
}
