package world.inclub.bonusesrewards.shared.bonus.infrastructure.controllers.dto.response;

import com.alibaba.excel.annotation.ExcelProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ClassificationExcelResponse {

    @ExcelProperty("Username")
    private String username;

    @ExcelProperty("Nombre Completo")
    private String fullName;

    @ExcelProperty("País de Residencia")
    private String countryOfResidence;

    @ExcelProperty("Correo Electrónico")
    private String email;

    @ExcelProperty("Teléfono")
    private String phone;

    @ExcelProperty("Rango")
    private String rankName;

    @ExcelProperty("Rango Actual")
    private String currentRankName;

    @ExcelProperty("Puntos Alcanzados")
    private Long achievedPoints;

    @ExcelProperty("Puntos Requeridos")
    private Long requiredPoints;

    @ExcelProperty("Ciclos de Recalificación")
    private Integer requalificationCycles;

    @ExcelProperty("Fecha de Inicio")
    private String startDate;

    @ExcelProperty("Fecha de Fin")
    private String endDate;

    @ExcelProperty("Fecha de Clasificación")
    private String classificationDate;

    @ExcelProperty("Estado de Notificación")
    private String notificationStatus;

}