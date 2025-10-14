package world.inclub.ticket.api.mapper;

import org.springframework.stereotype.Component;
import world.inclub.ticket.api.dto.PublicEventWithZonesResponseDto;
import world.inclub.ticket.infraestructure.controller.dto.UserTicketResponse;
import world.inclub.ticket.domain.model.ticket.Ticket;
import world.inclub.ticket.domain.model.payment.Payment;

import java.util.List;

import static world.inclub.ticket.domain.model.ticket.TicketNominationStatus.*;

@Component
public class UserTicketMapper {

    public UserTicketResponse toResponse(
            PublicEventWithZonesResponseDto event,
            List<Ticket> tickets,
            Payment payments
    ) {

        boolean allNominated = tickets.stream()
                .allMatch(ticket -> ticket.getNominationStatusId().equals(NOMINATED.getId()));

        List<String> pdfUrls = List.of();

        if (allNominated) {
            pdfUrls = tickets.stream()
                    .map(Ticket::getQrCodeUrl)
                    .toList();
        }
        
        return UserTicketResponse.builder()
                .event(UserTicketResponse.EventSummary.builder()
                        .id(event.getEventId().longValue())
                        .name(event.getEventName())
                        .type(event.getEventType().getEventTypeName())
                        .date(event.getEventDate())
                        .flyerUrl(event.getFlyerUrl())
                        .location(event.getVenue().getNameVenue())
                        .build())
                .paymentId(payments.getId())
                .pdfUrls(pdfUrls)
                .build();
    }

}
