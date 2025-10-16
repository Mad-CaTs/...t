package world.inclub.ticket.domain.model.ticket;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class Attendee {

    private Long id;
    private Long paymentId;
    private Long eventZoneId;
    private Long documentTypeId;
    private String documentNumber;
    private String email;
    private String name;
    private String lastName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
