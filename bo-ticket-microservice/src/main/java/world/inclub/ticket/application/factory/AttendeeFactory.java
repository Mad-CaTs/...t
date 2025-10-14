package world.inclub.ticket.application.factory;

import org.springframework.stereotype.Component;
import world.inclub.ticket.application.dto.MakePaymentCommand;
import world.inclub.ticket.application.dto.UpdateAttendeesCommand;
import world.inclub.ticket.domain.model.ticket.Attendee;
import world.inclub.ticket.utils.TimeLima;

import java.time.LocalDateTime;

@Component
public class AttendeeFactory {

    public Attendee createAttendee(MakePaymentCommand.Attendee attendee, Long paymentId) {
        LocalDateTime now = TimeLima.getLimaTime();
        return Attendee.builder()
                .paymentId(paymentId)
                .eventZoneId(attendee.eventZoneId())
                .name(attendee.name())
                .lastName(attendee.lastName())
                .documentTypeId(attendee.documentTypeId())
                .documentNumber(attendee.documentNumber())
                .email(attendee.email())
                .createdAt(now)
                .build();
    }

    public Attendee createAttendeeWithoutDetails(Long eventZoneId, Long paymentId) {
        LocalDateTime now = TimeLima.getLimaTime();
        return Attendee.builder()
                .paymentId(paymentId)
                .eventZoneId(eventZoneId)
                .createdAt(now)
                .build();
    }


    public Attendee updateAttendeeWithDetails(Attendee existingAttendee, UpdateAttendeesCommand.Attendee attendee) {
        LocalDateTime now = TimeLima.getLimaTime();
        return existingAttendee.toBuilder()
                .name(attendee.name())
                .lastName(attendee.lastName())
                .documentTypeId(attendee.documentTypeId())
                .documentNumber(attendee.documentNumber())
                .email(attendee.email())
                .updatedAt(now)
                .build();
    }

}
