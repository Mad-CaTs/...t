package world.inclub.wallet.api.dtos.response;

import lombok.Builder;
import org.springframework.data.relational.core.mapping.Column;
import java.math.BigDecimal;

@Builder
public record RejectedSuscriptionResponse(

        @Column("id_user")
        Long idUser,

        @Column("id_suscription")
        Long idSuscription,

        @Column("id_payment")
        Long idPayment,

        @Column("quote")
        BigDecimal quote,

        @Column("position")
        Long position,

        @Column("saldo_disponible")
        BigDecimal saldoDisponible,

        @Column("cuenta_contable")
        BigDecimal cuentaContable

) {}
