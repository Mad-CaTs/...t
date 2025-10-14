package world.inclub.ticket.application.mapper;

import org.springframework.stereotype.Component;
import world.inclub.ticket.application.dto.TicketWithAttendeeResponse;
import world.inclub.ticket.domain.model.ticket.Attendee;
import world.inclub.ticket.domain.model.ticket.Ticket;

@Component
public class TicketWithAttendeeMapper {

    public TicketWithAttendeeResponse toResponse(Ticket ticket, Attendee attendee) {
        return TicketWithAttendeeResponse.builder()
                .ticketUuid(ticket.getTicketUuid())
                .status(ticket.getStatus())
                .attendee(TicketWithAttendeeResponse.Attendee.builder()
                        .name(attendee.getName())
                        .lastName(attendee.getLastName())
                        .build())
                .build();
    }

}
