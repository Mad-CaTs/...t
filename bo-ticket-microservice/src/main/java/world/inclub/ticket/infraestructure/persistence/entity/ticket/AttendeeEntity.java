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
@AllArgsConstructor
@NoArgsConstructor
@Table("attendees")
public class AttendeeEntity {

    @Id
    @Column("attendee_id")
    private Long id;

    @Column("payment_id")
    private Long paymentId;

    @Column("event_zone_id")
    private Long eventZoneId;

    @Column("document_type_id")
    private Long documentTypeId;

    @Column("document_number")
    private String documentNumber;

    @Column("email")
    private String email;

    @Column("name")
    private String name;

    @Column("last_name")
    private String lastName;

    @Column("created_at")
    private LocalDateTime createdAt;

    @Column("updated_at")
    private LocalDateTime updatedAt;

}
