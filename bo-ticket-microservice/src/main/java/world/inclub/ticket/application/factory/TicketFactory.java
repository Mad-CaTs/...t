package world.inclub.ticket.application.factory;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import world.inclub.ticket.application.port.HashService;
import world.inclub.ticket.domain.enums.TicketStatus;
import world.inclub.ticket.domain.model.payment.Payment;
import world.inclub.ticket.domain.model.ticket.Attendee;
import world.inclub.ticket.domain.model.ticket.Ticket;
import world.inclub.ticket.domain.model.ticket.TicketNominationStatus;
import world.inclub.ticket.utils.TimeLima;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class TicketFactory {

    private final HashService hashService;

    public Ticket createTicketNominated(Payment payment, Attendee attendee) {
        LocalDateTime now = TimeLima.getLimaTime();
        String code = generateTicketCode(payment.getEventId(), payment.getUserId(), attendee.getId());

        return Ticket.builder()
                .ticketCode(code)
                .eventId(payment.getEventId())
                .eventZoneId(attendee.getEventZoneId())
                .paymentId(payment.getId())
                .attendeeId(attendee.getId())
                .status(TicketStatus.ACTIVE)
                .nominationStatusId(TicketNominationStatus.NOMINATED.getId())
                .createdAt(now)
                .build();
    }

    public Ticket createTicketNotNominated(Payment payment, Attendee attendee) {
        LocalDateTime now = TimeLima.getLimaTime();
        String code = generateTicketCode(payment.getEventId(), payment.getUserId(), attendee.getId());

        return Ticket.builder()
                .ticketCode(code)
                .eventId(payment.getEventId())
                .eventZoneId(attendee.getEventZoneId())
                .paymentId(payment.getId())
                .attendeeId(attendee.getId())
                .status(TicketStatus.PENDING_NOMINATION)
                .nominationStatusId(TicketNominationStatus.NOT_NOMINATED.getId())
                .createdAt(now)
                .build();
    }

    public Ticket updateTicketWithQr(Ticket existingTicket, String qrCodeUrl) {
        return existingTicket.toBuilder()
                .qrCodeUrl(qrCodeUrl)
                .build();
    }

    public Ticket updateTicketForNomination(Ticket existingTicket) {
        LocalDateTime now = TimeLima.getLimaTime();
        return existingTicket.toBuilder()
                .status(TicketStatus.ACTIVE)
                .nominationStatusId(TicketNominationStatus.NOMINATED.getId())
                .updatedAt(now)
                .build();
    }

    private String generateTicketCode(Long eventId, Long userId, Long attendeeId) {
        String codeToHash = String.format("%d|%d|%d|%s", eventId, userId, attendeeId, TimeLima.getLimaTime().toString());
        return hashService.hashAndTrim(codeToHash, 12).toUpperCase();
    }

}
