package world.inclub.bonusesrewards.shared.rank.infrastructure.persistence.adapter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Repository;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.infrastructure.webclient.DataResponse;
import world.inclub.bonusesrewards.shared.rank.domain.model.MemberRankDetail;
import world.inclub.bonusesrewards.shared.rank.domain.port.MemberRankDetailRepositoryPort;
import world.inclub.bonusesrewards.shared.rank.infrastructure.persistence.response.MemberRankDetailResponse;
import world.inclub.bonusesrewards.shared.rank.infrastructure.persistence.mapper.MemberRankDetailMapper;
import world.inclub.bonusesrewards.shared.utils.StringUtils;

import java.util.List;

@Slf4j
@Repository
@RequiredArgsConstructor
public class MemberRankDetailRepositoryAdapter
        implements MemberRankDetailRepositoryPort {

    private final WebClient dashboardWebClient;
    private final MemberRankDetailMapper rankMapper;

    @Override
    public Flux<MemberRankDetail> findByMemberIdIn(Iterable<Long> memberIds) {
        String ids = StringUtils.joinIds(memberIds);
        return dashboardWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/v1/points/ranges")
                        .queryParam("ids", ids)
                        .build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<DataResponse<List<MemberRankDetailResponse>>>() {})
                .mapNotNull(DataResponse::data)
                .flatMapMany(Flux::fromIterable)
                .map(rankMapper::toDomain)
                .switchIfEmpty(Flux.empty());
    }

    @Override
    public Mono<MemberRankDetail> findByMemberId(Long id) {
        return dashboardWebClient.get()
                .uri("/api/v1/points/ranges/{id}", id)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<DataResponse<MemberRankDetailResponse>>() {})
                .mapNotNull(DataResponse::data)
                .map(rankMapper::toDomain)
                .switchIfEmpty(Mono.empty());
    }

}
