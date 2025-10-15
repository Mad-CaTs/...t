package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.CarAssignmentDetail;
import world.inclub.bonusesrewards.carbonus.domain.criteria.CarAssignmentDetailSearchCriteria;
import world.inclub.bonusesrewards.carbonus.domain.port.CarDetailsRepositoryPort;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.mapper.CarAssignmentDetailMapper;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository.CarAssignmentDetailR2dbcRepository;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class CarAssignmentDetailRepositoryAdapter
        implements CarDetailsRepositoryPort {

    private final CarAssignmentDetailMapper carDetailsMapper;
    private final CarAssignmentDetailR2dbcRepository r2dbcRepository;

    @Override
    public Mono<CarAssignmentDetail> findByIdWithDetails(UUID id) {
        return r2dbcRepository.findById(id)
                .map(carDetailsMapper::toDomain);
    }

    @Override
    public Flux<CarAssignmentDetail> searchCarsWithDetails(CarAssignmentDetailSearchCriteria criteria, Pageable pageable) {
        return r2dbcRepository.findWithFilters(
                criteria.brandName(),
                criteria.modelName(),
                criteria.startDate(),
                criteria.endDate(),
                pageable.limit(),
                pageable.offset()
        ).map(carDetailsMapper::toDomain);
    }

    @Override
    public Mono<Long> countCarsWithDetails(CarAssignmentDetailSearchCriteria criteria) {
        return r2dbcRepository.countWithFilters(
                criteria.brandName(),
                criteria.modelName(),
                criteria.startDate(),
                criteria.endDate()
        );
    }

}