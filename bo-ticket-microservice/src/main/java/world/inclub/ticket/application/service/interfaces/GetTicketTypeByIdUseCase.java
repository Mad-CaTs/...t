package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.TicketTypeResponseDTO;

public interface GetTicketTypeByIdUseCase {
    Mono<TicketTypeResponseDTO> getById(Integer id);
}
