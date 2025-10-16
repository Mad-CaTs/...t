package world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import static world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.schema.PaymentSchema.SCHEMA;
import static world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.schema.PaymentSchema.Table.PAYMENTS;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(value = PAYMENTS, schema = SCHEMA)
public class PaymentEntity {

    @Id
    private UUID id;

    @Column("bonus_type_id")
    private Integer bonusTypeId;

    @Column("source_table_type_id")
    private Integer sourceTableTypeId;

    @Column("source_record_id")
    private UUID sourceRecordId;

    @Column("member_id")
    private Long memberId;

    @Column("payment_type_id")
    private Integer paymentTypeId;

    @Column("payment_sub_type_id")
    private Integer paymentSubTypeId;

    @Column("status_id")
    private Integer statusId;

    @Column("currency_type_id")
    private Integer currencyTypeId;

    @Column("sub_total_amount")
    private BigDecimal subTotalAmount;

    @Column("commission_amount")
    private BigDecimal commissionAmount;

    @Column("total_amount")
    private BigDecimal totalAmount;

    @Column("payment_date")
    private Instant paymentDate;

    @Column("created_at")
    private Instant createdAt;

    @Column("updated_at")
    private Instant updatedAt;
}
