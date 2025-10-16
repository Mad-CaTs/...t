package world.inclub.ticket.application.port.ticket;

import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Mono;
import world.inclub.ticket.application.dto.NominationStatusResponse;
import world.inclub.ticket.application.dto.UpdateAttendeesCommand;
import world.inclub.ticket.infraestructure.controller.dto.PageResponse;

public interface TicketNominationService {

    Mono<PageResponse<NominationStatusResponse>> getUserPaymentsWithNominationStatus(Long userId, Pageable pageable);

    Mono<String> nominateTicket(UpdateAttendeesCommand command);

}
