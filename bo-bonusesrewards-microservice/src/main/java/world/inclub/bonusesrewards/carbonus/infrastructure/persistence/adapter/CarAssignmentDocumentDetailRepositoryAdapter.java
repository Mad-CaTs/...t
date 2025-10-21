package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarAssignmentDocumentDetail;
import world.inclub.bonusesrewards.carbonus.domain.port.CarAssignmentDocumentDetailRepositoryPort;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.mapper.CarAssignmentDocumentDetailViewEntityMapper;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository.CarAssignmentDocumentDetailR2dbcRepository;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class CarAssignmentDocumentDetailRepositoryAdapter
        implements CarAssignmentDocumentDetailRepositoryPort {

    private final CarAssignmentDocumentDetailR2dbcRepository repository;
    private final CarAssignmentDocumentDetailViewEntityMapper mapper;

    @Override
    public Flux<CarAssignmentDocumentDetail> findByCarAssignmentId(UUID carAssignmentId) {
        return repository.findByCarAssignmentId(carAssignmentId)
                .map(mapper::toDomain);
    }

}