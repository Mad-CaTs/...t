package world.inclub.ticket.infraestructure.persistence.entity.payment;

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
@Table(name = "payment_rejection")
public class PaymentRejectionEntity {

    @Id
    private Long id;

    @Column("payment_id")
    private Long paymentId;

    @Column("reason_id")
    private Long reasonId;

    @Column("note")
    private String note;

    @Column("created_at")
    private LocalDateTime createdAt;

}
