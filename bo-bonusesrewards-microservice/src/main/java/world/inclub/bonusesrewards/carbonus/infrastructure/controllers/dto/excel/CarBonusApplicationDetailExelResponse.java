package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.excel;

import com.alibaba.excel.annotation.ExcelProperty;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class CarBonusApplicationDetailExelResponse {
    @ExcelProperty("Username")
    private String username;

    @ExcelProperty("Nombre Completo")
    private String memberFullName;

    @ExcelProperty("Monto de Recarga (USD)")
    private BigDecimal bonusAmount;

    @ExcelProperty("Monto de Descuento (USD)")
    private BigDecimal discountAmount;

    @ExcelProperty("Concepto de Descuento")
    private String description;

    @ExcelProperty("Medio de Pago")
    private String paymentTypeCode;

    @ExcelProperty("Fecha de Descuento")
    private String appliedDate;
}