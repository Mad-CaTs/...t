package world.inclub.ticket.infraestructure.persistence.entity.ticket;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "ticket_nomination_history")
public class TicketNominationHistoryEntity {

    @Id
    @Column("nomination_history_id")
    private Long id;

    @Column("ticket_id")
    private Long ticketId;

    @Column("old_status_id")
    private Long oldStatusId;

    @Column("new_status_id")
    private Long newStatusId;

    @Column("note")
    private String note;

    @Column("created_by")
    private Long createdBy;

    @Column("created_at")
    private LocalDateTime createdAt;

}
