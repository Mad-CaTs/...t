package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Flux;
import world.inclub.ticket.api.dto.PublicEventWithZonesResponseDto;

public interface GetPublicEventsWithZonesUseCase {
    Flux<PublicEventWithZonesResponseDto> getPublicEventsWithZones();
}