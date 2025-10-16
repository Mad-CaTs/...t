package world.inclub.ticket.infraestructure.persistence.entity.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import world.inclub.ticket.domain.enums.PaymentMethod;
import world.inclub.ticket.domain.enums.UserType;
import world.inclub.ticket.domain.enums.CurrencyType;
import world.inclub.ticket.domain.enums.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "payments")
public class PaymentEntity {

    @Id
    @Column("payment_id")
    private Long id;

    @Column("user_id")
    private Long userId;

    @Column("event_id")
    private Long eventId;

    @Column("payment_method")
    private PaymentMethod method;

    @Column("payment_sub_type_id")
    private Integer paymentSubTypeId;

    @Column("user_type")
    private UserType userType;

    @Column("status")
    private PaymentStatus status;

    @Column("currency_type")
    private CurrencyType currencyType;

    @Column("ticket_quantity")
    private Integer ticketQuantity ;

    @Column("sub_total_amount")
    private BigDecimal subTotalAmount;

    @Column("commission_amount")
    private BigDecimal commissionAmount;

    @Column("total_amount")
    private BigDecimal totalAmount;

    @Column("created_at")
    private LocalDateTime createdAt;

    @Column("rejected_at")
    private LocalDateTime rejectedAt;

}
