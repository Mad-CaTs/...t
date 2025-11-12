package world.inclub.transfer.liquidation.api.dtos;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class PaymentVoucherMembershipDto {

	private Long id;
    private int idUser;
    private LocalDateTime creationDate;
    private String observation;
    private Integer status;
    private LocalDateTime modificationDate;
    private Integer boolMigration;
    private LocalDate nextExpiration;
    private Integer packageDetailId;
    private Integer idPackage;
    private Integer gracePeriodParameterId;
}