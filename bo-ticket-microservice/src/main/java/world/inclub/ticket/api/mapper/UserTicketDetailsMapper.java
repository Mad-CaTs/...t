package world.inclub.ticket.api.mapper;

import org.springframework.stereotype.Component;
import world.inclub.ticket.api.dto.PublicEventWithZonesResponseDto;
import world.inclub.ticket.domain.model.payment.Payment;
import world.inclub.ticket.domain.model.ticket.Attendee;
import world.inclub.ticket.domain.model.ticket.Ticket;
import world.inclub.ticket.domain.model.ticket.TicketNominationStatus;
import world.inclub.ticket.infraestructure.controller.dto.UserTicketDetailsResponse;

@Component
public class UserTicketDetailsMapper {

    public UserTicketDetailsResponse toResponse(Payment payment, PublicEventWithZonesResponseDto event, Ticket ticket, Attendee attendee) {

        TicketNominationStatus status = TicketNominationStatus.fromId(ticket.getNominationStatusId());
        String zonaName = event.getZones().stream()
                .filter(zone -> zone.getEventZoneId().equals(ticket.getEventZoneId()))
                .findFirst()
                .map(PublicEventWithZonesResponseDto.ZoneDetail::getZoneName)
                .orElse("");

        UserTicketDetailsResponse.AttendeeResponse attendeeResponse = attendee != null ? toAttendeeResponse(attendee) : null;

        return UserTicketDetailsResponse.builder()
                .paymentId(payment.getId())
                .orderNumber(String.format("%012d", payment.getId()))
                .purchaseDate(payment.getCreatedAt().toLocalDate())
                .eventName(event.getEventName())
                .eventDate(event.getEventDate())
                .validDate(event.getEventDate())
                .ticketUuid(ticket.getTicketUuid())
                .zoneName(zonaName)
                .status(status)
                .pdfUrl(ticket.getQrCodeUrl())
                .attendee(attendeeResponse)
                .build();
    }

    private UserTicketDetailsResponse.AttendeeResponse toAttendeeResponse(Attendee attendee) {
        return UserTicketDetailsResponse.AttendeeResponse.builder()
                .documentTypeId(attendee.getDocumentTypeId())
                .documentNumber(attendee.getDocumentNumber())
                .name(attendee.getName())
                .lastName(attendee.getLastName())
                .email(attendee.getEmail())
                .build();
    }

}
