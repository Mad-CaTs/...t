package world.inclub.ticket.infraestructure.persistence.entity.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "payment_detail")
public class PaymentDetailEntity {

    @Id
    @Column("detail_id")
    private Long id;

    @Column("payment_id")
    private Long paymentId;

    @Column("item_type_id")
    private Long itemTypeId;

    @Column("item_id")
    private Long itemId;

    @Column("ticket_quantity")
    private Integer ticketQuantity;

    @Column("unit_price")
    private BigDecimal unitPrice;

    @Column("total_price")
    private BigDecimal totalPrice;

    @Column ("created_at")
    private LocalDateTime createdAt;

}
