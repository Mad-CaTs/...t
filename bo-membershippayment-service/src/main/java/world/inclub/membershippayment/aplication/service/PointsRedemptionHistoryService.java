package world.inclub.membershippayment.aplication.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.domain.dto.request.PointsRedemptionHistoryRequest;
import world.inclub.membershippayment.domain.entity.PointsRedemptionHistory;
import world.inclub.membershippayment.infraestructure.repository.PointsRedemptionHistoryRepository;

@Service
@RequiredArgsConstructor
@Slf4j
public class PointsRedemptionHistoryService {

    private final PointsRedemptionHistoryRepository repository;

    public Flux<PointsRedemptionHistory> getRedemptionHistoryByUser(Integer idUser) {
        return repository.findByIdUser(idUser)
                .doOnNext(record -> log.info("Found redemption record for user {}: {}", idUser, record));
    }

    public Mono<PointsRedemptionHistory> createPointsRedemptionHistory(PointsRedemptionHistoryRequest request) {
        PointsRedemptionHistory entity = PointsRedemptionHistory.builder()
                .idUser(request.getIdUser())
                .redemptionType(request.getRedemptionType())
                .redemptionCode(request.getRedemptionCode())
                .serviceType(request.getServiceType())
                .description(request.getDescription())
                .usageDate(request.getUsageDate())
                .checkInDate(request.getCheckInDate())
                .checkOutDate(request.getCheckOutDate())
                .rewards(request.getRewards())
                .usedPoints(request.getUsedPoints())
                .build();

        return repository.save(entity);
    }
}
