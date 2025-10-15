package world.inclub.bonusesrewards.shared.rank.infrastructure.persistence.adapter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Repository;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.infrastructure.webclient.DataResponse;
import world.inclub.bonusesrewards.shared.rank.domain.model.Rank;
import world.inclub.bonusesrewards.shared.rank.domain.port.RankRepositoryPort;
import world.inclub.bonusesrewards.shared.rank.infrastructure.persistence.response.RankResponse;
import world.inclub.bonusesrewards.shared.rank.infrastructure.persistence.mapper.RankMapper;

import java.util.List;

@Slf4j
@Repository
@RequiredArgsConstructor
public class RankRepositoryAdapter
        implements RankRepositoryPort {
    private final WebClient treeWebClient;
    private final RankMapper rankMapper;

    @Override
    public Flux<Rank> findAll() {
        return getAllRanks();
    }

    @Override
    public Mono<Rank> findById(Long id) {
        return getAllRanks()
                .filter(rank -> rank.id().equals(id))
                .next();
    }

    private Flux<Rank> getAllRanks() {
        return treeWebClient.get()
                .uri("/api/v1/three/ranges/active")
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<DataResponse<List<RankResponse>>>() {})
                .map(DataResponse::data)
                .flatMapMany(Flux::fromIterable)
                .map(rankMapper::toDomain)
                .switchIfEmpty(Flux.empty());
    }
}
