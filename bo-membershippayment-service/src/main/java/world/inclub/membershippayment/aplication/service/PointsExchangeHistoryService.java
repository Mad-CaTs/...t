package world.inclub.membershippayment.aplication.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.domain.entity.PointsExchangeHistory;
import world.inclub.membershippayment.infraestructure.repository.PointsExchangeHistoryRepository;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class PointsExchangeHistoryService {

    private final PointsExchangeHistoryRepository repo;

    public Mono<PointsExchangeHistory> registerPointsExchangeHistory(
            Long idSuscription,
            Integer idUser,
            Integer rewards,
            Integer pointsUsed,
            String membership,
            String portfolio,
            String observation
    ) {
        PointsExchangeHistory history = PointsExchangeHistory.builder()
                .idSuscription(idSuscription)
                .idUser(idUser)
                .movementDate(LocalDateTime.now())
                .rewards(rewards)
                .pointsUsed(pointsUsed)
                .membership(membership)
                .portfolio(portfolio)
                .observation(observation)
                .build();

        return repo.save(history);
    }

}