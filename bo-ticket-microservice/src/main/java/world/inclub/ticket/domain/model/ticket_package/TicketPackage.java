package world.inclub.ticket.domain.model.ticket_package;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class TicketPackage {
    private Long id;
    private Long eventId;
    private String name;
    private String description;
    private Long currencyTypeId;
    private BigDecimal pricePen;
    private BigDecimal priceUsd;
    private Long statusId;
    private LocalDateTime createdAt;
    private LocalDate expirationDate;
    private LocalDateTime updatedAt;
}
