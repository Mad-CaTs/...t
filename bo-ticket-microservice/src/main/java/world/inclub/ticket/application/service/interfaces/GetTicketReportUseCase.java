package world.inclub.ticket.application.service.interfaces;

import reactor.core.publisher.Flux;
import world.inclub.ticket.api.dto.TicketReportResponseDto;

public interface GetTicketReportUseCase {
    Flux<TicketReportResponseDto> getTicketReport(Integer eventId);
}
