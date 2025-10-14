package world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.shared.bonus.domain.model.Period;
import world.inclub.bonusesrewards.shared.bonus.domain.port.PeriodRepositoryPort;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.entity.PeriodEntity;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.mapper.PeriodEntityMapper;
import world.inclub.bonusesrewards.shared.infrastructure.webclient.DataResponse;
import world.inclub.bonusesrewards.shared.utils.StringUtils;

import java.util.List;

@Component
@RequiredArgsConstructor
public class PeriodRepositoryAdapter
        implements PeriodRepositoryPort {

    private final WebClient adminWebClient;
    private final PeriodEntityMapper periodEntityMapper;

    @Override
    public Flux<Period> findByIdIn(Iterable<Long> ids) {
        String idsString = StringUtils.joinIds(ids);
        return adminWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/period/ids/{ids}")
                        .build(idsString))
                .retrieve()
                .bodyToFlux(new ParameterizedTypeReference<DataResponse<List<PeriodEntity>>>() {})
                .flatMapIterable(DataResponse::data)
                .map(periodEntityMapper::toDomain);
    }

}