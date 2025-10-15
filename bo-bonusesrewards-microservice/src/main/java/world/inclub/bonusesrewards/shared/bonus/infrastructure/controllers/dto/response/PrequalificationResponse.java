package world.inclub.bonusesrewards.shared.bonus.infrastructure.controllers.dto.response;

import com.alibaba.excel.annotation.ExcelIgnore;
import com.alibaba.excel.annotation.ExcelProperty;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder(toBuilder = true)
public class PrequalificationResponse {

    @ExcelIgnore
    private Long memberId;

    @ExcelProperty("Username")
    private String username;

    @ExcelProperty("Nombre Completo")
    private String fullName;

    @ExcelProperty("País de Residencia")
    private String countryOfResidence;

    @ExcelProperty("Rango")
    private String rankName;

    @ExcelProperty("Rango Actual")
    private String currentRankName;

    @ExcelProperty("Puntos Alcanzados")
    private Long achievedPoints;

    @ExcelProperty("Puntos Requeridos")
    private Long requiredPoints;

    @ExcelProperty("Puntos Faltantes")
    private Long missingPoints;

    @ExcelProperty("Fecha de Inicio")
    private String startDate;

    @ExcelProperty("Fecha de Fin")
    private String endDate;

    @ExcelProperty("N° Ciclos Recalificados")
    private Integer requalificationCycles;

}