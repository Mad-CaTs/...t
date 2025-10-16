package world.inclub.ticket.application.port.ticket;

import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.model.payment.Payment;
import world.inclub.ticket.domain.model.ticket.Attendee;
import world.inclub.ticket.domain.model.ticket.Ticket;

public interface TicketPdfService {

    /**
     * Generates a PDF for the given ticket, attendee, and payment information.
     *
     * @param ticket   The ticket information.
     * @param attendee The attendee information.
     * @param payment  The payment information.
     * @return A Mono emitting the generated PDF as a byte array.
     */
    Mono<byte[]> generatePdfForTicket(Ticket ticket, Attendee attendee, Payment payment);

}
