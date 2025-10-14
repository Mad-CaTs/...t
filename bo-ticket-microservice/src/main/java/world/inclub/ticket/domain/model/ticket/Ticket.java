package world.inclub.ticket.domain.model.ticket;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import world.inclub.ticket.domain.enums.TicketStatus;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {

    private Long id;
    private UUID ticketUuid;
    private String ticketCode;
    private Long eventId;
    private Long eventZoneId;
    private Long paymentId;
    private Long attendeeId;
    private String qrCodeUrl;
    private TicketStatus status;
    private Long nominationStatusId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime usedAt;

}
