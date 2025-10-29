package world.inclub.bonusesrewards.shared.bonus.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.util.function.Tuple2;
import reactor.util.function.Tuples;
import world.inclub.bonusesrewards.shared.bonus.application.dto.PrequalificationSummary;
import world.inclub.bonusesrewards.shared.bonus.application.mapper.PrequalificationSummaryMapper;
import world.inclub.bonusesrewards.shared.bonus.application.usecase.member.GetPrequalificationsUseCase;
import world.inclub.bonusesrewards.shared.bonus.application.usecase.member.SearchPrequalificationsUseCase;
import world.inclub.bonusesrewards.shared.bonus.domain.model.*;
import world.inclub.bonusesrewards.shared.bonus.domain.port.BonusRequirementRepositoryPort;
import world.inclub.bonusesrewards.shared.bonus.domain.port.ClassificationRepositoryPort;
import world.inclub.bonusesrewards.shared.bonus.domain.port.CompoundPeriodRepositoryPort;
import world.inclub.bonusesrewards.shared.bonus.domain.port.PeriodRepositoryPort;
import world.inclub.bonusesrewards.shared.exceptions.EntityNotFoundException;
import world.inclub.bonusesrewards.shared.member.domain.model.Country;
import world.inclub.bonusesrewards.shared.member.domain.model.Member;
import world.inclub.bonusesrewards.shared.member.domain.port.CountryRepositoryPort;
import world.inclub.bonusesrewards.shared.member.domain.port.MemberRepositoryPort;
import world.inclub.bonusesrewards.shared.rank.domain.model.MemberRankDetail;
import world.inclub.bonusesrewards.shared.rank.domain.port.MemberRankDetailRepositoryPort;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PageDataBuilder;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PagedData;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
@Service
@RequiredArgsConstructor
public class PrequalificationsService
        implements GetPrequalificationsUseCase,
                   SearchPrequalificationsUseCase {

    private final CompoundPeriodRepositoryPort compoundPeriodRepository;
    private final BonusRequirementRepositoryPort bonusRequirementRepository;
    private final ClassificationRepositoryPort classificationRepository;
    private final MemberRepositoryPort memberRepository;
    private final CountryRepositoryPort countryRepository;
    private final PeriodRepositoryPort periodRepository;
    private final MemberRankDetailRepositoryPort memberRankDetailRepository;
    private final PrequalificationSummaryMapper prequalificationSummaryMapper;

    @Override
    public Flux<PrequalificationSummary> getPrequalifications(
            Long periodMin,
            Long periodMax,
            Long rankId,
            Long minRequalifications
    ) {
        return bonusRequirementRepository.findByRankId(rankId)
                .collectList()
                .switchIfEmpty(Mono.error(new EntityNotFoundException(
                        "No bonus requirements found for that rank")))
                .flatMapMany(bonusRequirements -> {
                    Mono<List<Prequalification>> allPrequalificationsMono = compoundPeriodRepository
                            .findTopRequalifications(
                                    periodMin, periodMax, rankId, minRequalifications)
                            .collectList();

                    Mono<List<Long>> classifiedMemberIdsMono = classificationRepository
                            .findByRankId(rankId)
                            .map(Classification::memberId)
                            .collectList();

                    return Mono.zip(allPrequalificationsMono, classifiedMemberIdsMono)
                            .flatMapMany(tuple -> {
                                List<Prequalification> allPrequalifications = tuple.getT1();
                                List<Long> classifiedMemberIds = tuple.getT2();

                                List<Prequalification> filteredPrequalifications = allPrequalifications.stream()
                                        .filter(p -> !classifiedMemberIds.contains(p.userId()))
                                        .toList();

                                return mapToSummaries(filteredPrequalifications, bonusRequirements)
                                        .collectList()
                                        .flatMap(this::validateSummaries)
                                        .flatMapMany(Flux::fromIterable);
                            });
                });
    }

    @Override
    public Mono<PagedData<PrequalificationSummary>> searchPrequalifications(
            Long periodMin,
            Long periodMax,
            Long rankId,
            Long minRequalifications,
            Pageable pageable
    ) {
        return bonusRequirementRepository.findByRankId(rankId)
                .switchIfEmpty(Mono.error(new EntityNotFoundException(
                        "No bonus requirements found for that rank")))
                .collectList()
                .flatMap(bonusRequirements -> {
                    Mono<List<Prequalification>> allPrequalificationsMono = compoundPeriodRepository
                            .findTopRequalifications(
                                    periodMin, periodMax, rankId, minRequalifications)
                            .collectList();

                    Mono<List<Long>> classifiedMemberIdsMono = classificationRepository
                            .findByRankId(rankId)
                            .map(Classification::memberId)
                            .collectList();

                    return Mono.zip(allPrequalificationsMono, classifiedMemberIdsMono)
                            .flatMap(tuple -> {
                                List<Prequalification> allPrequalifications = tuple.getT1();
                                List<Long> classifiedMemberIds = tuple.getT2();

                                List<Prequalification> filteredPrequalifications = allPrequalifications.stream()
                                        .filter(p -> !classifiedMemberIds.contains(p.userId()))
                                        .toList();

                                int total = filteredPrequalifications.size();
                                int offset = pageable.offset();
                                int limit = pageable.limit();
                                List<Prequalification> paginatedPrequalifications = filteredPrequalifications.stream()
                                        .skip(offset)
                                        .limit(limit)
                                        .toList();

                                return mapToSummaries(paginatedPrequalifications, bonusRequirements)
                                        .collectList()
                                        .flatMap(this::validateSummaries)
                                        .map(validSummaries ->
                                                     PageDataBuilder.build(validSummaries, pageable, (long) total));
                            });
                });
    }

    private Flux<Tuple2<Member, String>> getMembersWithResidence(Iterable<Long> memberIds) {
        Flux<Member> membersFlux = memberRepository.getByIdIn(memberIds)
                .switchIfEmpty(Mono.error(new EntityNotFoundException(
                        "No members found for the given IDs")));

        return membersFlux.collectList()
                .flatMapMany(members -> {
                    List<Long> countryIds = members.stream()
                            .map(Member::residenceCountryId)
                            .distinct()
                            .toList();

                    Flux<Country> countriesFlux = countryRepository.findByIdIn(countryIds)
                            .switchIfEmpty(Mono.error(new EntityNotFoundException(
                                    "No countries found for the given IDs")));

                    return countriesFlux.collectList()
                            .flatMapMany(countries -> Flux.fromIterable(members)
                                    .map(member -> {
                                        Country country = countries.stream()
                                                .filter(c -> c.id().equals(member.residenceCountryId()))
                                                .findFirst()
                                                .orElse(null);
                                        String countryName = country != null ? country.name() : "Unknown nationality";
                                        return Tuples.of(member, countryName);
                                    })
                            );
                });
    }

    private Flux<Period> getPeriods(Iterable<Long> periodIds) {
        return periodRepository.findByIdIn(periodIds)
                .switchIfEmpty(Mono.error(new EntityNotFoundException(
                        "No periods found for the given IDs")));
    }

    private Flux<PrequalificationSummary> mapToSummaries(
            List<Prequalification> prequalifications,
            List<BonusRequirement> bonusRequirements
    ) {
        // Extract unique user IDs
        Set<Long> userIds = prequalifications.stream()
                .map(Prequalification::userId)
                .collect(Collectors.toSet());

        // Extract unique period IDs from prequalifications
        Set<Long> periodIds = prequalifications.stream()
                .flatMap(p -> Stream.of(p.startPeriod(), p.endPeriod()))
                .collect(Collectors.toSet());

        // Get member residence information and period information in parallel
        Mono<Map<Long, Tuple2<Member, String>>> membersMono = getMembersWithResidence(userIds)
                .collectMap(t -> t.getT1().id(), t -> t);

        Mono<Map<Long, Period>> periodsMono = getPeriods(periodIds)
                .collectMap(Period::id, p -> p);

        // Get current rank information for all members
        Flux<MemberRankDetail> currentRanks = memberRankDetailRepository
                .findByMemberIdIn(userIds)
                .switchIfEmpty(Mono.error(new EntityNotFoundException(
                        "No rank details found for the given member IDs")));

        return Mono.zip(membersMono, periodsMono, currentRanks.collectList())
                .flatMapMany(lookupData -> {
                    Map<Long, Tuple2<Member, String>> membersMap = lookupData.getT1();
                    Map<Long, Period> periodsMap = lookupData.getT2();
                    List<MemberRankDetail> currentRanksMap = lookupData.getT3();

                    // Use mapper to create summaries
                    return prequalificationSummaryMapper.toSummary(
                            prequalifications,
                            membersMap,
                            periodsMap,
                            currentRanksMap,
                            bonusRequirements
                    );
                });
    }

    private Mono<List<PrequalificationSummary>> validateSummaries(List<PrequalificationSummary> summaries) {
        if (summaries.isEmpty()) {
            return Mono.error(new EntityNotFoundException(
                    "The campaign does not have valid requirements for the member's rank"));
        }
        return Mono.just(summaries);
    }

}