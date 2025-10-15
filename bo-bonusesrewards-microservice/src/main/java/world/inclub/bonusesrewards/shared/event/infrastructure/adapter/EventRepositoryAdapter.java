package world.inclub.bonusesrewards.shared.event.infrastructure.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Repository;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.shared.event.domain.model.Event;
import world.inclub.bonusesrewards.shared.event.domain.port.EventRepositoryPort;
import world.inclub.bonusesrewards.shared.event.infrastructure.entity.EventEntity;
import world.inclub.bonusesrewards.shared.event.infrastructure.mapper.EventEntityMapper;
import world.inclub.bonusesrewards.shared.infrastructure.webclient.DataResponse;
import world.inclub.bonusesrewards.shared.utils.StringUtils;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class EventRepositoryAdapter
        implements EventRepositoryPort {

    private final WebClient ticketWebClient;
    private final EventEntityMapper eventEntityMapper;

    @Override
    public Flux<Event> findByIdIn(Iterable<Long> eventIds) {
        return ticketWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/events/by-ids")
                .queryParam("ids", StringUtils.joinIds(eventIds))
                        .build())
                .retrieve()
                .bodyToFlux(new ParameterizedTypeReference<DataResponse<List<EventEntity>>>() {})
                .flatMapIterable(DataResponse::data)
                .map(eventEntityMapper::toDomain);
    }

}