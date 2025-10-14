package world.inclub.ticket.domain.model.ticket_package;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class EventPackageItem {
    private Long id;
    private Long ticketPackageId;
    private Long eventZoneId;
    private Integer quantity;
    private Integer quantityFree;
}