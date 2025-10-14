package world.inclub.ticket.application.port.ticket;

import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Mono;
import world.inclub.ticket.application.dto.NominationStatusResponse;
import world.inclub.ticket.application.dto.UpdateAttendeesCommand;
import world.inclub.ticket.infraestructure.controller.dto.PageResponse;

import java.util.List;
import java.util.UUID;

public interface TicketNominationService {

    Mono<PageResponse<NominationStatusResponse>> getUserPaymentsWithNominationStatus(Long userId, Pageable pageable);

    Mono<String> nominateTicket(UpdateAttendeesCommand command);

    Mono<String> renominateTicket(List<UUID> ticketUuids);

}
