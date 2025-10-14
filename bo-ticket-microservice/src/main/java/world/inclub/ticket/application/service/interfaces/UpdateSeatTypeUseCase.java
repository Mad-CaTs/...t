package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.SeatTypeRequestDto;
import world.inclub.ticket.api.dto.SeatTypeResponseDTO;

import java.util.UUID;

public interface UpdateSeatTypeUseCase {
    Mono<SeatTypeResponseDTO>  updateById(Integer Id, SeatTypeRequestDto dto, UUID updatedBy);
}
