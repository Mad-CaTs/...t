package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.CarBonusApplication;
import world.inclub.bonusesrewards.carbonus.domain.port.CarBonusApplicationRepositoryPort;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarBonusApplicationEntity;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository.CarBonusApplicationR2dbcRepository;

@Component
@RequiredArgsConstructor
public class CarBonusApplicationRepositoryAdapter
        implements CarBonusApplicationRepositoryPort {
    private final CarBonusApplicationR2dbcRepository repository;

    @Override
    public Mono<CarBonusApplication> save(CarBonusApplication carBonusApplication) {
        CarBonusApplicationEntity entity = toEntity(carBonusApplication);
        return repository.save(entity).map(this::toDomain);
    }

    private CarBonusApplicationEntity toEntity(CarBonusApplication domain) {
        return CarBonusApplicationEntity.builder()
                .id(domain.id())
                .carAssignmentId(domain.carAssignmentId())
                .paymentTypeId(domain.paymentTypeId())
                .bonusAmount(domain.bonusAmount())
                .discountAmount(domain.discountAmount())
                .isInitial(domain.isInitial())
                .description(domain.description())
                .appliedDate(domain.appliedDate())
                .build();
    }

    private CarBonusApplication toDomain(CarBonusApplicationEntity entity) {
        return new CarBonusApplication(
                entity.getId(),
                entity.getCarAssignmentId(),
                entity.getPaymentTypeId(),
                entity.getBonusAmount(),
                entity.getDiscountAmount(),
                entity.getIsInitial(),
                entity.getDescription(),
                entity.getAppliedDate()
        );
    }
}
