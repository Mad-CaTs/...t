package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.adapter;

import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.shared.rank.domain.model.Rank;
import world.inclub.bonusesrewards.shared.rank.domain.port.RankRepositoryPort;

import java.util.Collection;
import java.util.List;
import java.util.function.BiFunction;
import java.util.function.Function;

public class RankMappingUtil {

    public static <E, D> Flux<D> mapEntitiesWithRanks(
            Flux<E> source,
            Function<E, Long> getMemberId,
            Function<E, Long> getRankId,
            BiFunction<E, Rank, D> toDomainMapper,
            RankRepositoryPort rankRepositoryPort
    ) {
        return source
                .collectMultimap(getMemberId)
                .flatMapMany(memberMap -> {
                    List<Long> rankIds = memberMap.values().stream()
                            .flatMap(Collection::stream)
                            .map(getRankId)
                            .distinct()
                            .toList();

                    return rankRepositoryPort.findByIds(rankIds)
                            .collectMap(Rank::id)
                            .flatMapMany(rankMap ->
                                    Flux.fromIterable(memberMap.values())
                                            .flatMap(Flux::fromIterable)
                                            .map(entity -> toDomainMapper.apply(entity, rankMap.get(getRankId.apply(entity))))
                            );
                });
    }
}