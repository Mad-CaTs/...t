package world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import static world.inclub.bonusesrewards.shared.bonus.infrastructure.persistence.schema.BonusSchema.SCHEMA;
import static world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.schema.PaymentSchema.View.PAYMENTS_LIST_VIEW;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(value = PAYMENTS_LIST_VIEW, schema = SCHEMA)
public class PaymentListViewEntity {

    @Id
    @Column("payment_id")
    private UUID paymentId;

    @Column("username")
    private String username;

    @Column("member_full_name")
    private String memberFullName;

    @Column("nrodocument")
    private String nrodocument;

    @Column("operation_number")
    private String operationNumber;

    @Column("bonus_type_id")
    private Long bonusTypeId;

    @Column("bonus_type_name")
    private String bonusTypeName;

    @Column("installment_num")
    private Integer installmentNum;

    @Column("sub_total_amount")
    private BigDecimal subTotalAmount;

    @Column("commission_amount")
    private BigDecimal commissionAmount;

    @Column("rate_amount")
    private BigDecimal rateAmount;

    @Column("total_amount")
    private BigDecimal totalAmount;

    @Column("due_date")
    private LocalDate dueDate;

    @Column("payment_date")
    private LocalDateTime paymentDate;

    @Column("voucher_image_url")
    private String voucherImageUrl;

    @Column("payment_status_id")
    private Long paymentStatusId;

    @Column("payment_status_name")
    private String paymentStatusName;
}
