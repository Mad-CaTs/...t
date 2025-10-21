package world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import static world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.schema.PaymentSchema.SCHEMA;
import static world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.schema.PaymentSchema.Table.PAYMENT_REJECTION_REASONS;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(value = PAYMENT_REJECTION_REASONS, schema = SCHEMA)
public class PaymentRejectionReasonEntity {

    @Id
    @Column("reason_id")
    private Long reasonId;

    @Column("reason")
    private String reason;
}
