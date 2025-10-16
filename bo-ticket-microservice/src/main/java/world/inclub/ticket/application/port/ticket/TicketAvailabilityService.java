package world.inclub.ticket.application.port.ticket;

import reactor.core.publisher.Mono;
import world.inclub.ticket.application.dto.MakePaymentCommand;
import world.inclub.ticket.application.dto.TicketQrPayload;
import world.inclub.ticket.domain.enums.TicketStatus;

import java.util.UUID;

public interface TicketAvailabilityService {

    Mono<Void> reserveAvailability(MakePaymentCommand command);

    Mono<TicketQrPayload> validateQr(String qrCode);

    Mono<Boolean> updateQrStatus(UUID ticketUuid, TicketStatus status);

}
