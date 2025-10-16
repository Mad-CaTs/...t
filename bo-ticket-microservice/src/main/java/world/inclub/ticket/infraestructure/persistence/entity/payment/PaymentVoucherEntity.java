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
@Table(name = "payments_vouchers")
public class PaymentVoucherEntity {

    @Id
    @Column("voucher_id")
    private Long id;

    @Column("payment_id")
    private Long paymentId;

    @Column("operation_number")
    private String operationNumber;

    @Column("note")
    private String note;

    @Column("image_url")
    private String imageUrl;

    @Column("created_at")
    private LocalDateTime createdAt;

}
