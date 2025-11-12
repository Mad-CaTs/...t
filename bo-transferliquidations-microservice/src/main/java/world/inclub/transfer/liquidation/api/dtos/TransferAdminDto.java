package world.inclub.transfer.liquidation.api.dtos;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class TransferAdminDto {

	private Integer idTransferAdmin;
	private Integer idTransfer;
    private Integer idUserOld;
    private Integer idUserNew;
    private Integer idPerfil;
    private Integer idSponsor;
    private Integer idStatus;
	private Integer idTypeTransfer;
	private Integer idSuscription;
	private LocalDateTime creationDate;
	private String modificationUser;
	private String creationUser;
	private LocalDateTime modificationDate;
    
}