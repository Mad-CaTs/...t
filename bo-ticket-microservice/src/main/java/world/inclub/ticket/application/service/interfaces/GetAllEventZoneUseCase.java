package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Flux;
import world.inclub.ticket.api.dto.EventZoneResponseDto;

public interface GetAllEventZoneUseCase {
    Flux<EventZoneResponseDto> getAll();
}