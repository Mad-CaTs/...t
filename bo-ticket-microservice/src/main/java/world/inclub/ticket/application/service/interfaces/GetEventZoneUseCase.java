package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.EventZoneResponseDto;

public interface GetEventZoneUseCase {
    Mono<EventZoneResponseDto> getEventZone(Integer id);
}