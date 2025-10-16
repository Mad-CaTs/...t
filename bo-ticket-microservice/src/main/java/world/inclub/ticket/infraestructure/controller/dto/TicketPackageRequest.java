package world.inclub.ticket.infraestructure.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketPackageRequest {
    private Long eventId;
    private String name;
    private String description;
    private Long currencyTypeId;
    private BigDecimal pricePen;
    private BigDecimal priceUsd;
    private Long statusId;
    private LocalDate expirationDate;
    private Long changedBy;

    private List<TicketPackageItemRequest> items;
}
