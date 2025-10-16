package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.TicketTypeRequestDTO;
import world.inclub.ticket.api.dto.TicketTypeResponseDTO;

import java.util.UUID;

public interface CreateTicketTypeUseCase {
    Mono<TicketTypeResponseDTO> create(TicketTypeRequestDTO dto, UUID updatedBy);
}
