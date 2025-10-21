package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.excel;

import com.alibaba.excel.annotation.ExcelProperty;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class CarPaymentScheduleExelResponse {

    @ExcelProperty("Concepto")
    private String concept;

    @ExcelProperty("Valor de cuota de financiamiento neto")
    private BigDecimal financingInstallment;

    @ExcelProperty("Seguro y Soat (USD)")
    private BigDecimal insurance;

    @ExcelProperty("Inicial Fraccionada (USD)")
    private BigDecimal inicialInstallment;

    @ExcelProperty("Bono Inicial (USD)")
    private BigDecimal initialBonus;

    @ExcelProperty("GPS (USD)")
    private BigDecimal gps;

    @ExcelProperty("Bono Mensual (USD)")
    private BigDecimal monthlyBonus;

    @ExcelProperty("Pago asumido por el socio (USD)")
    private BigDecimal memberAssumedPayment;

    @ExcelProperty("Total (USD)")
    private BigDecimal total;

    @ExcelProperty("Fecha de vencimiento")
    private String dueDate;

    @ExcelProperty("Estado")
    private String status;

    @ExcelProperty("Fecha de pago")
    private String paymentDate;

}
