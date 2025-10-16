package world.inclub.ticket.infraestructure.persistence.entity.ticket;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import world.inclub.ticket.domain.enums.TicketStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tickets")
public class TicketEntity {

    @Id
    @Column("ticket_id")
    private Long id;

    @Column("ticket_uuid")
    private UUID ticketUuid;

    @Column("ticket_code")
    private String ticketCode;

    @Column("event_id")
    private Long eventId;

    @Column("event_zone_id")
    private Long eventZoneId;

    @Column("payment_id")
    private Long paymentId;

    @Column("attendee_id")
    private Long attendeeId;

    @Column("qr_code_url")
    private String qrCodeUrl;

    @Column("status")
    private TicketStatus status;

    @Column("nomination_status_id")
    private Long nominationStatusId;

    @Column("created_at")
    private LocalDateTime createdAt;

    @Column("updated_at")
    private LocalDateTime updatedAt;

    @Column("used_at")
    private LocalDateTime usedAt;

}
