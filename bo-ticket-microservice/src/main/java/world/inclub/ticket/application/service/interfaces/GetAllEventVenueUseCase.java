package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Flux;
import world.inclub.ticket.api.dto.EventVenueResponseDto;

public interface GetAllEventVenueUseCase {
    Flux<EventVenueResponseDto> getAll();
}
