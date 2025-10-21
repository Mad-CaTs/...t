package world.inclub.bonusesrewards.carbonus.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.application.usecase.carrankbonus.*;
import world.inclub.bonusesrewards.carbonus.domain.factory.CarRankBonusFactory;
import world.inclub.bonusesrewards.carbonus.domain.model.CarQuotation;
import world.inclub.bonusesrewards.carbonus.domain.model.CarRankBonus;
import world.inclub.bonusesrewards.carbonus.domain.model.CarRankBonusStatus;
import world.inclub.bonusesrewards.carbonus.domain.port.CarAssignmentRepositoryPort;
import world.inclub.bonusesrewards.carbonus.domain.port.CarQuotationRepositoryPort;
import world.inclub.bonusesrewards.carbonus.domain.port.CarRankBonusRepositoryPort;
import world.inclub.bonusesrewards.carbonus.domain.validator.CarAssignmentValidator;
import world.inclub.bonusesrewards.carbonus.domain.validator.CarRankBonusValidator;
import world.inclub.bonusesrewards.shared.bonus.domain.port.ClassificationRepositoryPort;
import world.inclub.bonusesrewards.shared.exceptions.EntityNotFoundException;
import world.inclub.bonusesrewards.shared.rank.domain.model.Rank;
import world.inclub.bonusesrewards.shared.rank.domain.port.RankRepositoryPort;

import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CarRankBonusService
        implements SaveCarRankBonusUseCase,
                   UpdateCarRankBonusUseCase,
                   DeleteCarRankBonusUseCase,
                   GetCarRankBonusByQuotationIdUseCase {

    private final CarRankBonusRepositoryPort carRankBonusRepositoryPort;
    private final RankRepositoryPort rankRepositoryPort;
    private final CarRankBonusFactory carRankBonusFactory;
    private final CarRankBonusValidator carRankBonusValidator;
    private final CarAssignmentRepositoryPort carAssignmentRepositoryPort;
    private final CarQuotationRepositoryPort carQuotationRepositoryPort;
    private final ClassificationRepositoryPort classificationRepositoryPort;
    private final CarAssignmentValidator carAssignmentValidator;

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
                        .flatMap(rank -> Mono.just(rank)
                                // If the rank is being changed, check for existing active rank bonuses with the new
                                // rank
                                .filter(r -> !Objects.equals(r.id(), existing.rankId()))
                                .flatMap(r -> carRankBonusRepositoryPort
                                        .existsByStatusIdAndRankId(r.id(), CarRankBonusStatus.ACTIVE.getId())
                                        .doOnNext(activeExists -> carRankBonusValidator
                                                .validateUniqueActiveRank(carRankBonus, activeExists))
                                        .then(Mono.just(r)))
                                .switchIfEmpty(Mono.just(rank))
                                .flatMap(r -> validateIfCarRankBonusIsUsed(id)
                                        .flatMap(isUsed -> Mono.just(isUsed)
                                                .filter(Boolean::booleanValue)
                                                // If used in schedules, set existing to SUPERSEDED and create a new one
                                                .flatMap(__ -> updateToSuperseded(existing)
                                                        .then(saveCarRankBonus(carRankBonus)))
                                                // If not used in schedules, update directly
                                                .switchIfEmpty(update(existing, carRankBonus)))
                                )
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
    public Mono<CarRankBonus> findByQuotationId(UUID quotationId) {
        return carQuotationRepositoryPort.findById(quotationId)
                .switchIfEmpty(Mono.error
                        (new EntityNotFoundException("Quotation not found with id: " + quotationId)))
                .doOnNext(carAssignmentValidator::validateQuotation)
                .flatMap(carQuotation -> classificationRepositoryPort
                        .findById(carQuotation.classificationId())
                        .switchIfEmpty(Mono.error
                                (new EntityNotFoundException("Classification not found with id: " + carQuotation.classificationId())))
                        .flatMap(classification -> findRankById(classification.rankId())
                                .flatMap(memberRankDetail -> carRankBonusRepositoryPort
                                        .findByRankIdAndStatusId
                                                (memberRankDetail.id(), CarRankBonusStatus.ACTIVE.getId())
                                        .switchIfEmpty(Mono.error
                                                (new EntityNotFoundException("No active bonus found for rank " + memberRankDetail.name())))
                                )
                        ));
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

    private Mono<CarRankBonus> updateToExpired(CarRankBonus existing) {
        CarRankBonus toUpdate = carRankBonusFactory.updateToExpired(existing);
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
