package world.inclub.membershippayment.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Voucher {
    private String operationNumber;
    private Integer methodSubTipoPagoId;
    private String note;
    private BigDecimal subTotalAmount;
    private BigDecimal comissionSubTipoPago;
    private BigDecimal totalAmount;
    private LocalDate creationDate;
    private String companyOperationNumber;
    private String imagenBase64;
    private Integer suscriptionId;
}

