package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.EventVenueResponseDto;

public interface GetEventVenueUseCase {
    Mono<EventVenueResponseDto> getById(Integer id);
}
