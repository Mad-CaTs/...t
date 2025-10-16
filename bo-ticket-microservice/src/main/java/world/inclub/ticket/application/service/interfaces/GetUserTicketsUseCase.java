package world.inclub.ticket.application.service.interfaces;

import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.model.EventStatus;
import world.inclub.ticket.infraestructure.controller.dto.PageResponse;
import world.inclub.ticket.infraestructure.controller.dto.UserTicketDetailsResponse;
import world.inclub.ticket.infraestructure.controller.dto.UserTicketResponse;

public interface GetUserTicketsUseCase {

    Mono<PageResponse<UserTicketResponse>> getUserTickets(Long userId, EventStatus status, Pageable pageable);

    Mono<PageResponse<UserTicketDetailsResponse>> getUserTicketsDetails(Long paymentId, Pageable pageable);

}
