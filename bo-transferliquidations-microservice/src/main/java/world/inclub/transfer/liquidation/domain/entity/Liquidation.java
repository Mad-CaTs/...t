package world.inclub.transfer.liquidation.domain.entity;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import world.inclub.transfer.liquidation.domain.constant.DatabaseConstants;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = DatabaseConstants.LIQUIDATION, schema = DatabaseConstants.SCHEMA_NAME)
public class Liquidation {

	@Id
    @Column("idliquidation")
    private Long idliquidation;

    @Column("idUser")
    private Integer idUser;

    @Column("idStatus")
    private Integer idStatus;

    @Column("idTypeTransfer")
    private Integer idTypeTransfer;

    @Column("idSuscription")
    private Integer idSuscription;

    @Column("idReasonLiquidation")
    private Integer idReasonLiquidation;

    @Column("idOptionReturnMoney")
    private Integer idOptionReturnMoney;

    @Column("amountPayment")
    private Double amountPayment;

    @Column("amountPenality")
    private Double amountPenality;

    @Column("amountFavour")
    private Double amountFavour;

    @Column("creationUser")
    private String creationUser;

    @Column("creationDate")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime creationDate = LocalDateTime.now();

    @Column("modificationUser")
    private String modificationUser;

    @Column("modificationDate")
    private LocalDateTime modificationDate;
    
}