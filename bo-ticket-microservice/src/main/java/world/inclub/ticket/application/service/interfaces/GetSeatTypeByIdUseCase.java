package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.SeatTypeResponseDTO;

public interface GetSeatTypeByIdUseCase {
    Mono<SeatTypeResponseDTO> getById(Integer Id);
}
