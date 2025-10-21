package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.excel;

import com.alibaba.excel.annotation.ExcelProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CarQuotationSummaryExelResponse {

    @ExcelProperty("Username")
    private String username;

    @ExcelProperty("Nombre Completo")
    private String memberFullName;

    @ExcelProperty("País de Residencia")
    private String countryOfResidence;

    @ExcelProperty("Rango")
    private String rankName;

    @ExcelProperty("Fecha de Registro")
    private String lastQuotationDate;

    @ExcelProperty("Estado de Revisión")
    private String reviewed;

}
