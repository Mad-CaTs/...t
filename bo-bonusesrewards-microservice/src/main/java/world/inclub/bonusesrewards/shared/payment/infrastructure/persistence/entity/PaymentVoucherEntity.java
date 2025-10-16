package world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.Instant;
import java.util.UUID;

import static world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.schema.PaymentSchema.SCHEMA;
import static world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.schema.PaymentSchema.Table.PAYMENT_VOUCHERS;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(value = PAYMENT_VOUCHERS, schema = SCHEMA)
public class PaymentVoucherEntity {

    @Id
    private Long id;

    @Column("payment_id")
    private UUID paymentId;

    @Column("operation_number")
    private String operationNumber;

    @Column("note")
    private String note;

    @Column("image_url")
    private String imageUrl;

    @Column("created_at")
    private Instant createdAt;
}
