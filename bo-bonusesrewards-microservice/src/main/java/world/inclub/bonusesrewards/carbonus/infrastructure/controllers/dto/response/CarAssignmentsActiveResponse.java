package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.response;

import com.alibaba.excel.annotation.ExcelIgnore;
import com.alibaba.excel.annotation.ExcelProperty;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder(toBuilder = true)
public class CarAssignmentsActiveResponse {
    
    @ExcelIgnore 
    private UUID carAssignmentId;
    
    @ExcelIgnore 
    private Long memberId;
    
    @ExcelProperty("Nombre Completo") 
    private String memberFullName;
    
    @ExcelProperty("Usuario") 
    private String username;
    
    @ExcelProperty("Marca") 
    private String brandName;
    
    @ExcelProperty("Modelo") 
    private String modelName;
    
    @ExcelProperty("Precio del Auto (USD)") 
    private BigDecimal priceUsd;
    
    @ExcelProperty("Total de Cuotas Iniciales") 
    private Integer totalInitialInstallments;
    
    @ExcelProperty("Cuotas Iniciales Pagadas") 
    private Long paidInitialInstallments;
    
    @ExcelProperty("Total de Cuotas Mensuales") 
    private Integer totalMonthlyInstallments;
    
    @ExcelProperty("Cuotas Mensuales Pagadas") 
    private Long paidMonthlyInstallments;
    
    @ExcelProperty("Bono Mensual Asignado (USD)") 
    private BigDecimal assignedMonthlyBonusUsd;
    
    @ExcelProperty("Cuota Mensual (USD)") 
    private String monthlyInstallmentUsd;
    
    @ExcelProperty("Rango Actual") 
    private String currentRankName;
    
    @ExcelProperty("Fecha de Asignación") 
    private String assignedDate;
}