package world.inclub.ticket.infraestructure.controller.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class PaginatedValidatePaymentsResponseDto {
    
    private List<ValidatePaymentResponseDto> payments; // Lista de pagos
    private Integer currentPage; // Página actual
    private Integer totalPages; // Total de páginas
    private Long totalElements; // Total de elementos
    private Integer pageSize; // Tamaño de página
    private Boolean hasNext; // Tiene siguiente página
    private Boolean hasPrevious; // Tiene página anterior
}
