package world.inclub.bonusesrewards.shared.payment.infrastructure.controllers.dto.excel;

import com.alibaba.excel.annotation.ExcelProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentPendingExcelResponse {

    @ExcelProperty("Username")
    private String username;

    @ExcelProperty("Nombre Completo")
    private String memberFullName;

    @ExcelProperty("DNI")
    private String nrodocument;

    @ExcelProperty("Fecha de Solicitud")
    private String paymentDate;

    @ExcelProperty("Código de Operación")
    private String operationNumber;

    @ExcelProperty("Tipo de Bono")
    private String bonusTypeName;

    @ExcelProperty("Número de Inicial")
    private String installmentInfo;

    @ExcelProperty("Voucher")
    private String voucherImg;
}
