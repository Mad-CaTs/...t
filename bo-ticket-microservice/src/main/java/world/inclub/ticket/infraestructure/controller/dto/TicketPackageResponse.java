package world.inclub.ticket.infraestructure.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import world.inclub.ticket.domain.model.ticket_package.EventPackageItem;
import world.inclub.ticket.domain.model.ticket_package.TicketPackage;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketPackageResponse {
    private Long ticketPackageId;
    private String name;
    private String description;
    private BigDecimal pricePen;
    private BigDecimal priceUsd;
    private LocalDate expirationDate;
    private List<TicketPackageItemResponse> items;

    public static TicketPackageResponse fromDomain(TicketPackage pkg, List<EventPackageItem> items) {
        return TicketPackageResponse.builder()
                .ticketPackageId(pkg.getId())
                .name(pkg.getName())
                .description(pkg.getDescription())
                .pricePen(pkg.getPricePen())
                .priceUsd(pkg.getPriceUsd())
                .expirationDate(pkg.getExpirationDate())
                .items(items.stream().map(i -> new TicketPackageItemResponse(
                        i.getId(),
                        i.getEventZoneId(),
                        i.getQuantity(),
                        i.getQuantityFree()
                )).toList())
                .build();
    }
}
