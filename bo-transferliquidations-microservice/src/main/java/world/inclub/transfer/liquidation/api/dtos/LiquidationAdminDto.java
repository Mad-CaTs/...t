package world.inclub.transfer.liquidation.api.dtos;

import lombok.Data;
import org.springframework.data.relational.core.mapping.Column;

import java.time.LocalDateTime;

@Data
public class LiquidationAdminDto {

	private Integer idLiquidationAdmin;
	private Integer idLiquidation;
	private Integer idUser;
	private Integer idStatus;
	private Integer idTypeTransfer;
	private Integer idSuscription;
	private Integer idReasonLiquidation;
	private Integer idOptionReturnMoney;
	private Double amountPayment;
	private Double amountPenality;
	private Double amountFavour;
	private String creationUser;
	private LocalDateTime creationDate;
	private String modificationUser;
	private LocalDateTime modificationDate;
    
}