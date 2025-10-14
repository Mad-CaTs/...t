package world.inclub.ticket.domain.model.ticket_package;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class TicketPackageHistory {
    private Long id;
    private Long ticketPackageId;
    private String action;
    private String oldValue;
    private String newValue;
    private LocalDateTime changedAt;
    private Long changedBy;
}
