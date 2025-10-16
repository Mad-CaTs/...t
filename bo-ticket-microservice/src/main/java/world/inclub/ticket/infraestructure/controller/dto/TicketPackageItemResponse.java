package world.inclub.ticket.infraestructure.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketPackageItemResponse {
    private Long eventPackageItemId;
    private Long eventZoneId;
    private Integer quantity;
    private Integer quantityFree;
}
