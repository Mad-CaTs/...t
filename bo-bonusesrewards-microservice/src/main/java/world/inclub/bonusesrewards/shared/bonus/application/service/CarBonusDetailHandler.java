package world.inclub.bonusesrewards.shared.bonus.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.util.function.Tuple2;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarAssignmentWithClassification;
import world.inclub.bonusesrewards.carbonus.domain.model.CarRankBonus;
import world.inclub.bonusesrewards.carbonus.domain.model.CarRankBonusStatus;
import world.inclub.bonusesrewards.carbonus.domain.port.CarAssignmentRepositoryPort;
import world.inclub.bonusesrewards.carbonus.domain.port.CarRankBonusRepositoryPort;
import world.inclub.bonusesrewards.shared.bonus.application.dto.ClassificationDetailSummary;
import world.inclub.bonusesrewards.shared.bonus.domain.model.BonusRequirement;
import world.inclub.bonusesrewards.shared.bonus.domain.model.Classification;
import world.inclub.bonusesrewards.shared.bonus.domain.model.Prequalification;
import world.inclub.bonusesrewards.shared.bonus.domain.port.ClassificationRepositoryPort;
import world.inclub.bonusesrewards.shared.bonus.domain.util.BonusRequirementFinder;
import world.inclub.bonusesrewards.shared.rank.domain.model.Rank;
import world.inclub.bonusesrewards.shared.rank.domain.port.RankRepositoryPort;

import java.math.BigDecimal;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class CarBonusDetailHandler {

    private final CarRankBonusRepositoryPort carRankBonusRepositoryPort;
    private final RankRepositoryPort rankRepositoryPort;
    private final ClassificationRepositoryPort classificationRepository;
    private final CarAssignmentRepositoryPort carAssignmentRepositoryPort;

    public Flux<ClassificationDetailSummary> getDetails(
            Long memberId,
            List<BonusRequirement> requirements,
            List<Prequalification> prequalifications
    ) {
        return carRankBonusRepositoryPort
                .findByStatusId(CarRankBonusStatus.ACTIVE.getId())
                .defaultIfEmpty(CarRankBonus.empty())
                .collectList()
                .flatMapMany(carRankBonuses -> {
                    List<Long> rankIds = carRankBonuses.stream()
                            .map(CarRankBonus::rankId)
                            .distinct()
                            .toList();
                    return rankRepositoryPort.findByIds(rankIds).collectList()
                            .flatMapMany(ranks -> {
                                List<Long> sortedRankIds = rankIds.stream()
                                        .sorted(Comparator.comparing(rankId -> getPosition(rankId, ranks)))
                                        .toList();
                                return classificationRepository
                                        .findByMemberIdAndRankIds(memberId, sortedRankIds).collectList()
                                        .flatMapMany(classifications -> {
                                            List<UUID> classificationIds = classifications.stream()
                                                    .map(Classification::id)
                                                    .filter(Objects::nonNull)
                                                    .distinct()
                                                    .toList();
                                            Flux<CarAssignmentWithClassification> assignmentsFlux = classificationIds
                                                    .isEmpty() ? Flux.empty() :
                                                    carAssignmentRepositoryPort
                                                            .findByClassificationIds(classificationIds);
                                            return assignmentsFlux
                                                    .collectList()
                                                    .map(assignments -> {
                                                        Map<Long, List<BonusRequirement>> reqMap = requirements.stream()
                                                                .collect(Collectors.groupingBy(BonusRequirement::rankId));

                                                        return sortedRankIds.stream()
                                                                .map(rankId -> {
                                                                    Prequalification prequalification =
                                                                            prequalifications.stream()
                                                                                    .filter(p -> p.rankId()
                                                                                            .equals(rankId))
                                                                                    .findFirst()
                                                                                    .orElse(Prequalification.empty());

                                                                    Classification classification =
                                                                            classifications.stream()
                                                                                    .filter(c -> c.rankId()
                                                                                            .equals(rankId))
                                                                                    .findFirst()
                                                                                    .orElse(Classification.empty());

                                                                    Rank rank = ranks.stream()
                                                                            .filter(r -> r.id().equals(rankId))
                                                                            .findFirst()
                                                                            .orElse(Rank.empty());

                                                                    BonusRequirement maxBonusRequirementAchieved =
                                                                            reqMap.containsKey(rankId) ?
                                                                                    BonusRequirementFinder.findMatchingRequirement(
                                                                                            reqMap.get(rankId),
                                                                                            rankId,
                                                                                            prequalification.numRequalifications() == null ? 0 :
                                                                                                    prequalification.numRequalifications()
                                                                                    ) : null;
                                                                    List<ClassificationDetailSummary.Option> options =
                                                                            reqMap.containsKey(rankId) ?
                                                                                    buildOptionsForPrequalification(
                                                                                            reqMap.get(rankId),
                                                                                            prequalification,
                                                                                            classification,
                                                                                            maxBonusRequirementAchieved)
                                                                                    : List.of();

                                                                    return new ClassificationDetailSummary(
                                                                            classification.id() == null ? null :
                                                                                    classification.id(),
                                                                            getCarAssignmentId(classification.id(),
                                                                                               assignments),
                                                                            rankId,
                                                                            rank.name() == null ? "Unknown Rank" :
                                                                                    rank.name(),
                                                                            prequalification.totalDirectPoints() == null
                                                                                    ? 0 :
                                                                                    prequalification.totalDirectPoints(),
                                                                            maxBonusRequirementAchieved != null ?
                                                                                    maxBonusRequirementAchieved.directPoints() : 0,
                                                                            getBonus(carRankBonuses, rankId,
                                                                                     CarRankBonus::initialBonus),
                                                                            getBonus(carRankBonuses, rankId,
                                                                                     CarRankBonus::monthlyBonus),
                                                                            getBonus(carRankBonuses, rankId,
                                                                                     CarRankBonus::bonusPrice),
                                                                            options);
                                                                })
                                                                .toList();
                                                    })
                                                    .flatMapMany(Flux::fromIterable);
                                        });
                            });
                });
    }

    private UUID getCarAssignmentId(
            UUID classificationId,
            List<CarAssignmentWithClassification> assignments
    ) {
        if (classificationId == null) {
            return null;
        }
        log.info("Finding CarAssignmentId for ClassificationId: {}", classificationId);
        log.info("Available assignments: {}", assignments);
        return assignments.stream()
                .filter(a -> Objects.equals(a.classificationId(), classificationId))
                .map(CarAssignmentWithClassification::carAssignmentId)
                .findFirst()
                .orElse(null);
    }

    private BigDecimal getBonus(
            List<CarRankBonus> bonuses,
            Long rankId,
            Function<CarRankBonus, BigDecimal> bonusMapper
    ) {
        return bonuses.stream()
                .filter(Objects::nonNull)
                .filter(b -> Objects.equals(b.rankId(), rankId))
                .map(bonusMapper)
                .filter(Objects::nonNull)
                .findFirst()
                .orElse(BigDecimal.ZERO);
    }


    private List<ClassificationDetailSummary.Option> buildOptionsForPrequalification(
            List<BonusRequirement> reqs,
            Prequalification prequalification,
            Classification classification,
            BonusRequirement achieved
    ) {
        return reqs.stream()
                .map(r -> new ClassificationDetailSummary.Option(
                        r.optionNumber(),
                        r.cycles(),
                        classification.achievedPoints() != null
                                ? (isAchieved(classification, r, achieved)
                                ? Optional.of(classification.achievedPoints()).orElse(0L).intValue() : 0)
                                : (isAchieved(classification, r, achieved)
                                ? Optional.ofNullable(prequalification.totalDirectPoints()).orElse(0) : 0),
                        r.directPoints(),
                        isAchieved(classification, r, achieved)
                ))
                .toList();
    }

    private Boolean isAchieved(Classification classification, BonusRequirement requirement, BonusRequirement achieved) {
        return requirement != null &&
                achieved != null &&
                Objects.equals(requirement.optionNumber(), achieved.optionNumber()) &&
                Objects.equals(classification.requiredPoints(), achieved.directPoints().longValue());
    }

    private Integer getPosition(Long rankId, List<Rank> ranks) {
        return ranks.stream()
                .filter(r -> Objects.equals(r.id(), rankId))
                .map(Rank::position)
                .filter(Objects::nonNull)
                .findFirst()
                .orElse(Integer.MAX_VALUE);
    }
}