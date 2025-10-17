package world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

import static world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.schema.PaymentSchema.SCHEMA;
import static world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.schema.PaymentSchema.Table.PAYMENT_REJECTION;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(value = PAYMENT_REJECTION, schema = SCHEMA)
public class PaymentRejectionEntity {

    @Id
    private UUID id;

    @Column("payment_id")
    private UUID paymentId;

    @Column("reason_id")
    private Long reasonId;

    @Column("note")
    private String note;

    @Column("created_at")
    private LocalDateTime createdAt;
}
