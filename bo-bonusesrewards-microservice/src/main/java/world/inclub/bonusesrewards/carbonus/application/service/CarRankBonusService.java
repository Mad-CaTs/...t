package world.inclub.bonusesrewards.carbonus.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.application.usecase.carrankbonus.*;
import world.inclub.bonusesrewards.carbonus.domain.factory.CarRankBonusFactory;
import world.inclub.bonusesrewards.carbonus.domain.model.CarRankBonus;
import world.inclub.bonusesrewards.carbonus.domain.model.CarRankBonusStatus;
import world.inclub.bonusesrewards.carbonus.domain.port.CarAssignmentRepositoryPort;
import world.inclub.bonusesrewards.carbonus.domain.port.CarRankBonusRepositoryPort;
import world.inclub.bonusesrewards.carbonus.domain.port.CarRepositoryPort;
import world.inclub.bonusesrewards.carbonus.domain.validator.CarRankBonusValidator;
import world.inclub.bonusesrewards.shared.exceptions.EntityNotFoundException;
import world.inclub.bonusesrewards.shared.rank.domain.model.Rank;
import world.inclub.bonusesrewards.shared.rank.domain.port.MemberRankDetailRepositoryPort;
import world.inclub.bonusesrewards.shared.rank.domain.port.RankRepositoryPort;

import java.util.UUID;

@Service
@RequiredArgsConstructor


public class CarRankBonusService
        implements SaveCarRankBonusUseCase,
                   UpdateCarRankBonusUseCase,
                   DeleteCarRankBonusUseCase,
                   GetCarRankBonusByMemberIdUseCase {

    private final CarRankBonusRepositoryPort carRankBonusRepositoryPort;
    private final RankRepositoryPort rankRepositoryPort;
    private final CarRankBonusFactory carRankBonusFactory;
    private final CarRankBonusValidator carRankBonusValidator;
    private final CarAssignmentRepositoryPort carAssignmentRepositoryPort;
    private final MemberRankDetailRepositoryPort memberRankDetailRepositoryPort;

    @Override
    public Mono<CarRankBonus> save(CarRankBonus carRankBonus) {
        carRankBonusValidator.validateCanBeCreated(carRankBonus);
        return findRankById(carRankBonus.rankId())
                .flatMap(rank -> carRankBonusRepositoryPort
                        // Check for existing active rank bonuses with the same rank
                        .existsByStatusIdAndRankId(rank.id(), CarRankBonusStatus.ACTIVE.getId())
                        .doOnNext(activeExists -> carRankBonusValidator
                                .validateUniqueActiveRank(carRankBonus, activeExists))
                        .then(saveCarRankBonus(carRankBonus))
                );
    }

    @Override
    public Mono<CarRankBonus> update(UUID id, CarRankBonus carRankBonus) {
        return findById(id)
                .doOnNext(carRankBonusValidator::validateCanBeUpdated)
                .flatMap(existing -> findRankById(carRankBonus.rankId())
                        .flatMap(rank -> validateIfCarRankBonusIsUsed(id)
                                .flatMap(isUsed -> Mono.just(isUsed)
                                        .filter(Boolean::booleanValue)
                                        // If used in schedules, set existing to SUPERSEDED and create a new one
                                        .flatMap(__ -> updateToSuperseded(existing)
                                                .then(saveCarRankBonus(carRankBonus)))
                                        // If not used in schedules, update directly
                                        .switchIfEmpty(update(existing, carRankBonus)))
                        )
                );
    }


    @Override
    public Mono<Void> deleteById(UUID id) {
        return findById(id)
                .flatMap(existing -> {
                    carRankBonusValidator.validateCanBeDeleted(existing);
                    return validateIfCarRankBonusIsUsed(id)
                            .flatMap(isUsed -> isUsed
                                    // If used in schedules, set to SUPERSEDED
                                    ? updateToCancelled(existing).then()
                                    // If not used in schedules, delete
                                    : carRankBonusRepositoryPort.deleteById(id)
                            );
                });
    }

    @Override
    public Mono<CarRankBonus> getByMemberId(Long memberId) {
        return memberRankDetailRepositoryPort.findByMemberId(memberId)
                .switchIfEmpty(Mono.error(new EntityNotFoundException("Member not found with id: " + memberId)))
                .flatMap(memberRankDetail -> carRankBonusRepositoryPort
                        .findByRankIdAndStatusId(memberRankDetail.rankId(), CarRankBonusStatus.ACTIVE.getId())
                        .switchIfEmpty(Mono.error
                                (new EntityNotFoundException("No active bonus found for member " + memberId
                                                                     + " with rank " + memberRankDetail.rankName())))
                );
    }

    private Mono<Boolean> validateIfCarRankBonusIsUsed(UUID rankBonusId) {
        return carAssignmentRepositoryPort.existsByRankBonusId(rankBonusId);
    }

    private Mono<CarRankBonus> findById(UUID id) {
        return carRankBonusRepositoryPort.findById(id)
                .switchIfEmpty(Mono.error(new EntityNotFoundException("CarRankBonus not found with id: " + id)));
    }

    private Mono<Rank> findRankById(Long rankId) {
        return rankRepositoryPort.findById(rankId)
                .switchIfEmpty(Mono.error(new EntityNotFoundException("Rank not found with id: " + rankId)));
    }

    private Mono<CarRankBonus> saveCarRankBonus(CarRankBonus carRankBonus) {
        CarRankBonus toSave = carRankBonusFactory.create(carRankBonus);
        return carRankBonusRepositoryPort.save(toSave);
    }

    private Mono<CarRankBonus> updateToSuperseded(CarRankBonus existing) {
        CarRankBonus toUpdate = carRankBonusFactory.updateToSuperseded(existing);
        return carRankBonusRepositoryPort.save(toUpdate);
    }

    private Mono<CarRankBonus> updateToCancelled(CarRankBonus existing) {
        CarRankBonus toUpdate = carRankBonusFactory.updateToCancelled(existing);
        return carRankBonusRepositoryPort.save(toUpdate);
    }

    private Mono<CarRankBonus> update(CarRankBonus oldCarRankBonus, CarRankBonus newCarRankBonus) {
        CarRankBonus toUpdate = carRankBonusFactory.update(oldCarRankBonus, newCarRankBonus);
        return carRankBonusRepositoryPort.save(toUpdate);
    }

}
