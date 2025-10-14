package world.inclub.ticket.infraestructure.persistence.mapper.ticket;

import org.springframework.stereotype.Component;
import world.inclub.ticket.domain.model.ticket.Attendee;
import world.inclub.ticket.domain.model.ticket.Ticket;
import world.inclub.ticket.infraestructure.persistence.entity.ticket.AttendeeEntity;
import world.inclub.ticket.infraestructure.persistence.entity.ticket.TicketEntity;

@Component
public class TicketEntityMapper {

    public Ticket toDomain(TicketEntity ticketEntity) {
        return new Ticket(
                ticketEntity.getId(),
                ticketEntity.getTicketUuid(),
                ticketEntity.getTicketCode(),
                ticketEntity.getEventId(),
                ticketEntity.getEventZoneId(),
                ticketEntity.getPaymentId(),
                ticketEntity.getAttendeeId(),
                ticketEntity.getQrCodeUrl(),
                ticketEntity.getStatus(),
                ticketEntity.getNominationStatusId(),
                ticketEntity.getCreatedAt(),
                ticketEntity.getUpdatedAt(),
                ticketEntity.getUsedAt()
        );
    }

    public TicketEntity toEntity(Ticket ticket) {
        return new TicketEntity(
                ticket.getId(),
                ticket.getTicketUuid(),
                ticket.getTicketCode(),
                ticket.getEventId(),
                ticket.getEventZoneId(),
                ticket.getPaymentId(),
                ticket.getAttendeeId(),
                ticket.getQrCodeUrl(),
                ticket.getStatus(),
                ticket.getNominationStatusId(),
                ticket.getCreatedAt(),
                ticket.getUpdatedAt(),
                ticket.getUsedAt()
        );
    }

}
