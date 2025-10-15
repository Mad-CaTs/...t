package world.inclub.bonusesrewards.shared.bonus.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.bonus.application.dto.ClassificationSummary;
import world.inclub.bonusesrewards.shared.bonus.application.mapper.ClassificationSummaryMapper;
import world.inclub.bonusesrewards.shared.bonus.application.usecase.classification.GetAllClassificationWithMemberUseCase;
import world.inclub.bonusesrewards.shared.bonus.application.usecase.classification.SearchClassificationsWithMemberUseCase;
import world.inclub.bonusesrewards.shared.bonus.domain.model.ClassificationWithMember;
import world.inclub.bonusesrewards.shared.bonus.domain.model.Period;
import world.inclub.bonusesrewards.shared.bonus.domain.port.ClassificationWithMemberRepositoryPort;
import world.inclub.bonusesrewards.shared.bonus.domain.port.PeriodRepositoryPort;
import world.inclub.bonusesrewards.shared.exceptions.EntityNotFoundException;
import world.inclub.bonusesrewards.shared.rank.domain.model.MemberRankDetail;
import world.inclub.bonusesrewards.shared.rank.domain.model.Rank;
import world.inclub.bonusesrewards.shared.rank.domain.port.MemberRankDetailRepositoryPort;
import world.inclub.bonusesrewards.shared.rank.domain.port.RankRepositoryPort;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PageDataBuilder;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PagedData;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
@Service
@RequiredArgsConstructor
public class ClassificationWithMemberService
        implements GetAllClassificationWithMemberUseCase,
                   SearchClassificationsWithMemberUseCase {

    private final ClassificationWithMemberRepositoryPort classificationsRepositoryPort;
    private final PeriodRepositoryPort periodRepositoryPort;
    private final MemberRankDetailRepositoryPort memberRankDetailRepository;
    private final RankRepositoryPort rankRepositoryPort;
    private final ClassificationSummaryMapper classificationSummaryMapper;

    @Override
    public Flux<ClassificationSummary> getAll(String member, Long rankId, Boolean notificationStatus) {
        return enrichClassifications(classificationsRepositoryPort.findAll(member, rankId, notificationStatus));
    }

    @Override
    public Mono<PagedData<ClassificationSummary>> searchClassifications(
            String member,
            Long rankId,
            Boolean notificationStatus,
            Pageable pageable
    ) {
        Flux<ClassificationSummary> classificationsFlux = enrichClassifications(
                classificationsRepositoryPort.findAll(member, rankId, notificationStatus, pageable));

        Mono<Long> countMono = classificationsRepositoryPort.countClassifications(member, rankId, notificationStatus)
                .defaultIfEmpty(0L);

        return Mono.zip(classificationsFlux.collectList(), countMono)
                .map(tuple -> {
                    List<ClassificationSummary> summaries = tuple.getT1();
                    Long total = tuple.getT2();

                    return PageDataBuilder.build(summaries, pageable, total);
                });
    }

    private Flux<ClassificationSummary> enrichClassifications(Flux<ClassificationWithMember> classificationsFlux) {
        return classificationsFlux
                .switchIfEmpty(Mono.error(new EntityNotFoundException("No classifications found")))
                .collectList()
                .flatMapMany(classifications -> {
                    Set<Long> periodIds = classifications.stream()
                            .flatMap(c -> Stream.of(c.startPeriodId(), c.endPeriodId()))
                            .collect(Collectors.toSet());

                    Set<Long> memberIds = classifications.stream()
                            .map(ClassificationWithMember::memberId)
                            .collect(Collectors.toSet());

                    Flux<Period> periodsMono = periodRepositoryPort.findByIdIn(periodIds)
                            .switchIfEmpty(Mono.error
                                    (new EntityNotFoundException("No periods found for the given IDs")));

                    Flux<MemberRankDetail> currentRanks = memberRankDetailRepository
                            .findByMemberIdIn(memberIds)
                            .switchIfEmpty(Mono.error(new EntityNotFoundException(
                                    "No rank details found for the given member IDs")));

                    Flux<Rank> rankFlux = rankRepositoryPort.findAll();

                    return Mono.zip(periodsMono.collectList(),
                                    currentRanks.collectList(),
                                    rankFlux.collectList())
                            .map(tuple -> {
                                List<Period> periods = tuple.getT1();
                                List<MemberRankDetail> memberRanks = tuple.getT2();
                                List<Rank> ranks = tuple.getT3();

                                return classifications.stream()
                                        .map(classification -> classificationSummaryMapper.toSummary(
                                                classification,
                                                periods,
                                                memberRanks,
                                                ranks))
                                        .toList();
                            })
                            .flatMapMany(Flux::fromIterable);
                });
    }


}