package world.inclub.ticket.application.factory;

import org.springframework.stereotype.Component;
import world.inclub.ticket.domain.model.payment.Payment;
import world.inclub.ticket.domain.model.ticket.Ticket;
import world.inclub.ticket.domain.model.ticket.TicketNominationHistory;
import world.inclub.ticket.utils.TimeLima;

@Component
public class TicketNominationHistoryFactory {

    public TicketNominationHistory createByUser(Long oldStatusId, Ticket finalTicket, Payment payment) {
        return TicketNominationHistory.builder()
                .ticketId(finalTicket.getId())
                .oldStatusId(oldStatusId)
                .newStatusId(finalTicket.getNominationStatusId())
                .note("Nomination status updated by user")
                .createdBy(payment.getUserId())
                .createdAt(TimeLima.getLimaTime())
                .build();
    }

}
