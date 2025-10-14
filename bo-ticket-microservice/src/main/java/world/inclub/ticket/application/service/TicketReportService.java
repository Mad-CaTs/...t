package world.inclub.ticket.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.TicketReportResponseDto;
import world.inclub.ticket.api.mapper.TicketReportMapper;
import world.inclub.ticket.application.service.interfaces.GetTicketReportUseCase;
import world.inclub.ticket.domain.ports.ticket.TicketReportRepositoryPort;
import world.inclub.ticket.domain.repository.EventRepository;
import world.inclub.ticket.infraestructure.exceptions.NotFoundException;

@Service
@RequiredArgsConstructor
public class TicketReportService implements GetTicketReportUseCase {

    private final TicketReportRepositoryPort repository;
    private final EventRepository eventRepository;

    @Override
    public Flux<TicketReportResponseDto> getTicketReport(Integer eventId) {
        return eventRepository.findById(eventId)
                .switchIfEmpty(Mono.error(new NotFoundException("Evento con id " + eventId + " no encontrado")))
                .flatMapMany(ev -> repository.findByEventId(eventId))
                .map(TicketReportMapper::toDto);
    }
}
