package world.inclub.ticket.infraestructure.persistence.repository.adapters.ticket;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.model.ticket.TicketNominationHistory;
import world.inclub.ticket.domain.ports.ticket.TicketNominationHistoryRepositoryPort;
import world.inclub.ticket.infraestructure.persistence.entity.ticket.TicketNominationHistoryEntity;
import world.inclub.ticket.infraestructure.persistence.mapper.ticket.TicketNominationHistoryMapper;
import world.inclub.ticket.infraestructure.persistence.repository.r2dbc.ticket.R2DbcTicketNominationHistoryRepository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class TicketNominationHistoryRepositoryAdapter implements TicketNominationHistoryRepositoryPort {

    private final R2DbcTicketNominationHistoryRepository ticketNominationHistoryRepository;
    private final TicketNominationHistoryMapper ticketNominationHistoryMapper;


    @Override
    public Mono<TicketNominationHistory> save(TicketNominationHistory history) {
        return ticketNominationHistoryRepository.save(ticketNominationHistoryMapper.toEntity(history))
                .map(ticketNominationHistoryMapper::toDomain);
    }

    @Override
    public Flux<TicketNominationHistory> saveAll(List<TicketNominationHistory> histories) {
        List< TicketNominationHistoryEntity> entities = histories.stream()
                .map(ticketNominationHistoryMapper::toEntity)
                .toList();
        return ticketNominationHistoryRepository.saveAll(entities)
                .map(ticketNominationHistoryMapper::toDomain);
    }
}
