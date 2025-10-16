package world.inclub.ticket.infraestructure.persistence.entity.ticket_package;

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
@Table(name = "ticket_package_history")
public class TicketPackageHistoryEntity {

    @Id
    @Column("history_id")
    private Long historyId;

    @Column ("ticket_package_id")
    private Long ticketPackageId;

    @Column ("action")
    private String action;

    @Column("old_value")
    private String oldValue;

    @Column ("new_value")
    private String newValue;

    @Column ("changed_at")
    private LocalDateTime changedAt;

    @Column ("changed_by")
    private Long changedBy;
}
