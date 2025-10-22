package world.inclub.membershippayment.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "subscription_delay", schema = "bo_membership")
public class SubscriptionDelay {

    @Id
    @Column("idsubscriptiondelay")
    private Long idSubscriptionDelay;

    // Clave única compuesta: (idPayment, idSubscription), para evitar duplicados
    @Column("idpayment")
    private Long idPayment;

    @Column("idsubscription")
    private Long idSubscription;

    @Column("days")
    private Integer days;

    @Column("paymentdate")
    private LocalDateTime paymentDate;

}
