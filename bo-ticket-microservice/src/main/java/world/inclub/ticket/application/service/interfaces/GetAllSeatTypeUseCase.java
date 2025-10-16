package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Flux;
import world.inclub.ticket.api.dto.SeatTypeResponseDTO;

public interface GetAllSeatTypeUseCase {
    Flux<SeatTypeResponseDTO>  getAll();
}
