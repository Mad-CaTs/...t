package world.inclub.ticket.infraestructure.persistence.entity.ticket_package;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "ticket_package")
public class TicketPackageEntity {
    @Id
    @Column("ticket_package_id")
    private Long ticketPackageId;

    @Column("event_id")
    private Long eventId;

    @Column("name")
    private String name;

    @Column("description")
    private String description;

    @Column("currency_type_id")
    private Long currencyTypeId;


    @Column("price_pen")
    private BigDecimal pricePen;

    @Column("price_usd")
    private BigDecimal priceUsd;

    @Column("status_id")
    private Long statusId;

    @Column("created_at")
    private LocalDateTime createdAt;

    @Column("expiration_date")
    private LocalDate expirationDate;

    @Column("updated_at")
    private LocalDateTime updatedAt;
}
