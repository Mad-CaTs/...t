package world.inclub.bonusesrewards.shared.bonus.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.shared.bonus.application.dto.ClassificationDetailSummary;
import world.inclub.bonusesrewards.shared.bonus.application.usecase.classification.ClassifyMemberUseCase;
import world.inclub.bonusesrewards.shared.bonus.application.usecase.classification.GetClassificationDetailsUseCase;
import world.inclub.bonusesrewards.shared.bonus.domain.factory.ClassificationFactory;
import world.inclub.bonusesrewards.shared.bonus.domain.model.BonusRequirement;
import world.inclub.bonusesrewards.shared.bonus.domain.model.BonusType;
import world.inclub.bonusesrewards.shared.bonus.domain.model.Classification;
import world.inclub.bonusesrewards.shared.bonus.domain.model.Prequalification;
import world.inclub.bonusesrewards.shared.bonus.domain.port.BonusRequirementRepositoryPort;
import world.inclub.bonusesrewards.shared.bonus.domain.port.ClassificationRepositoryPort;
import world.inclub.bonusesrewards.shared.bonus.domain.port.CompoundPeriodRepositoryPort;
import world.inclub.bonusesrewards.shared.bonus.domain.util.BonusRequirementFinder;
import world.inclub.bonusesrewards.shared.exceptions.EntityNotFoundException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClassifyMemberService
        implements ClassifyMemberUseCase,
                   GetClassificationDetailsUseCase {

    private final ClassificationRepositoryPort classificationRepository;
    private final CompoundPeriodRepositoryPort compoundPeriodRepository;
    private final BonusRequirementRepositoryPort bonusRequirementRepository;
    private final ClassificationFactory classificationFactory;
    private final CarBonusDetailHandler carBonusDetailHandler;

    @Override
    public Flux<Classification> classify(
            List<Long> memberIds,
            Long periodMin,
            Long periodMax,
            Long rankId,
            Long minRequalifications
    ) {
        return bonusRequirementRepository.findByRankId(rankId)
                .switchIfEmpty(Flux.error
                        (new EntityNotFoundException("No bonus requirement found for the given range")))
                .collectList()
                .flatMapMany(bonusRequirements -> compoundPeriodRepository
                        .findByMemberIds(memberIds, periodMin, periodMax, rankId, minRequalifications)
                        .switchIfEmpty(Flux.error
                                (new EntityNotFoundException("No periods found for the given members")))
                        .flatMap(requalification -> {
                            BonusRequirement requirement = BonusRequirementFinder.findMatchingRequirement(
                                    bonusRequirements,
                                    requalification.rankId(),
                                    requalification.numRequalifications()
                            );
                            Classification classification = classificationFactory.create(
                                    requalification.userId(),
                                    rankId,
                                    requalification.totalDirectPoints().longValue(),
                                    requirement.directPoints().longValue(),
                                    requalification.numRequalifications(),
                                    requalification.startPeriod(),
                                    requalification.endPeriod()
                            );
                            return classificationRepository.save(classification);
                        }));
    }

    @Override
    public Flux<ClassificationDetailSummary> getDetails(Long memberId, String bonusType) {
        BonusType type = BonusType.fromName(bonusType.toUpperCase());
        return bonusRequirementRepository.findByBonusTypeId(type.getId())
                .switchIfEmpty(Flux.error(new EntityNotFoundException("No requirements found for bonus type: " + bonusType)))
                .collectList()
                .flatMapMany(bonusRequirements -> {
                    List<Long> rankIds = bonusRequirements.stream()
                            .map(BonusRequirement::rankId)
                            .distinct()
                            .toList();
                    return compoundPeriodRepository.findByMemberIdAndRankIds(memberId, rankIds)
                            .collectList()
                            .flatMapMany(prequalifications ->
                                                 getByBonusType(memberId, type, bonusRequirements, prequalifications));
                });
    }

    private Flux<ClassificationDetailSummary> getByBonusType(
            Long memberId,
            BonusType type,
            List<BonusRequirement> requirements,
            List<Prequalification> prequalifications
    ) {
        return switch (type) {
            case CAR -> carBonusDetailHandler.getDetails(memberId, requirements, prequalifications);
            default -> Flux.error(new EntityNotFoundException("No handler found for bonus type: " + type.name()));
        };
    }

}