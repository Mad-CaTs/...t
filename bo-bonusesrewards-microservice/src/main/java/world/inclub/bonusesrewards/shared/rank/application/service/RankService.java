package world.inclub.bonusesrewards.shared.rank.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.exceptions.EntityNotFoundException;
import world.inclub.bonusesrewards.shared.rank.application.usecase.GetAllRankUseCase;
import world.inclub.bonusesrewards.shared.rank.application.usecase.GetRankByIdUseCase;
import world.inclub.bonusesrewards.shared.rank.domain.model.Rank;
import world.inclub.bonusesrewards.shared.rank.domain.port.RankRepositoryPort;

@Service
@RequiredArgsConstructor
public class RankService
        implements GetAllRankUseCase,
                   GetRankByIdUseCase {
    private final RankRepositoryPort rankRepositoryPort;

    @Override
    public Flux<Rank> getAllRanks() {
        return rankRepositoryPort.findAll()
                .switchIfEmpty(Mono.error(new EntityNotFoundException("No ranks found")));
    }

    @Override
    public Mono<Rank> getRankById(Long id) {
        return rankRepositoryPort.findById(id)
                .switchIfEmpty(Mono.error(new EntityNotFoundException("Rank not found with id: " + id)));
    }
}
