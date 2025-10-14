package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.PublicEventWithZonesResponseDto;

public interface GetPublicEventWithZonesByIdUseCase {
    Mono<PublicEventWithZonesResponseDto> getPublicEventWithZonesById(Integer id);
}