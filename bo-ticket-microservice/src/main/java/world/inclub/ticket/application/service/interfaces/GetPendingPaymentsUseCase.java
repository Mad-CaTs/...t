package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.ticket.infraestructure.controller.dto.PaginatedValidatePaymentsResponseDto;
import world.inclub.ticket.infraestructure.controller.dto.ValidatePaymentsFilterRequest;

public interface GetPendingPaymentsUseCase {
    
    /**
     * Obtiene pagos pendientes de validación con filtros y paginación
     * @param filterRequest Filtros de búsqueda
     * @return Pagos paginados
     */
    Mono<PaginatedValidatePaymentsResponseDto> getPendingPayments(ValidatePaymentsFilterRequest filterRequest);
}
