package world.inclub.ticket.application.factory;

import org.springframework.stereotype.Component;
import world.inclub.ticket.application.dto.NominationStatusResponse;
import world.inclub.ticket.application.enums.PaymentNominationStatusEnum;
import world.inclub.ticket.domain.model.Event;
import world.inclub.ticket.domain.model.payment.Payment;
import world.inclub.ticket.domain.model.ticket.Ticket;

import java.util.List;

@Component
public class NominationStatusResponseMapper {

    public NominationStatusResponse toResponse(Payment payment, Event event, List<Ticket> notNominatedTickets) {
        PaymentNominationStatusEnum status;

        int totalTicketsPurchased = payment.getTicketQuantity();
        int notNominatedCount = notNominatedTickets.size();

        if (notNominatedCount == 0) {
            status = PaymentNominationStatusEnum.NOMINATED;
        } else if (notNominatedCount == totalTicketsPurchased) {
            status = PaymentNominationStatusEnum.NOT_NOMINATED;
        } else {
            status = PaymentNominationStatusEnum.PARTIALLY_NOMINATED;
        }

        return NominationStatusResponse.builder()
                .paymentId(payment.getId())
                .orderNumber(String.format("%012d", payment.getId()))
                .paymentDate(payment.getCreatedAt())
                .eventName(event.getEventName())
                .totalTickets(payment.getTicketQuantity())
                .status(status)
                .build();
    }

}
