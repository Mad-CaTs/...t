package world.inclub.ticket.infraestructure.controller.mapper;

import org.springframework.stereotype.Component;
import world.inclub.ticket.application.dto.UpdateAttendeesCommand;
import world.inclub.ticket.infraestructure.controller.dto.NominationBatchRequest;

import java.util.List;

@Component
public class NominationBatchRequestMapper {

    public UpdateAttendeesCommand toCommand(NominationBatchRequest request) {
        List<UpdateAttendeesCommand.Attendee> attendees = request.nomineeRequests().stream()
                .map(this::toCommandAttendee)
                .toList();

        return new UpdateAttendeesCommand(
                request.paymentId(),
                attendees
        );
    }

    private UpdateAttendeesCommand.Attendee toCommandAttendee(NominationBatchRequest.NomineeRequest a) {
        return new UpdateAttendeesCommand.Attendee(
                a.ticketUuid(),
                a.documentTypeId(),
                a.documentNumber(),
                a.email(),
                a.name(),
                a.lastName()
        );
    }

}
