package world.inclub.membershippayment.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.domain.Persistable;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "paymentrejection", schema = "bo_membership")
public class PaymentRejection implements Persistable<Long> {
    @Id
    private Long id;
    private Integer idSuscription;
    private Integer idReason;
    private String detalle;
    private LocalDate fecha;
    private Integer idQuoteType;
    private Integer idPayment;

    @Override
    public boolean isNew() {
        return id == null || id == 0;
    }
}
