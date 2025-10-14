package world.inclub.bonusesrewards.shared.bonus.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.shared.bonus.application.usecase.classification.ClassifyMemberUseCase;
import world.inclub.bonusesrewards.shared.bonus.domain.factory.ClassificationFactory;
import world.inclub.bonusesrewards.shared.bonus.domain.model.BonusRequirement;
import world.inclub.bonusesrewards.shared.bonus.domain.model.Classification;
import world.inclub.bonusesrewards.shared.bonus.domain.port.BonusRequirementRepositoryPort;
import world.inclub.bonusesrewards.shared.bonus.domain.port.ClassificationRepositoryPort;
import world.inclub.bonusesrewards.shared.bonus.domain.port.CompoundPeriodRepositoryPort;
import world.inclub.bonusesrewards.shared.bonus.domain.util.BonusRequirementFinder;
import world.inclub.bonusesrewards.shared.exceptions.EntityNotFoundException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClassifyMemberService
        implements ClassifyMemberUseCase {

    private final ClassificationRepositoryPort classificationRepository;
    private final CompoundPeriodRepositoryPort compoundPeriodRepository;
    private final BonusRequirementRepositoryPort bonusRequirementRepository;
    private final ClassificationFactory classificationFactory;

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
}