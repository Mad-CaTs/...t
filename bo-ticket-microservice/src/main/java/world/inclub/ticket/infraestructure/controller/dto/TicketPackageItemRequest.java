package world.inclub.ticket.infraestructure.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketPackageItemRequest {
    private Long eventZoneId;
    private Integer quantity;
    private Integer quantityFree;
}