package world.inclub.wallet.api.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.relational.core.mapping.Column;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RejectedSuscriptionDTO<T> {

    Long idUser;
    Long idSuscription;
    Long idPayment;
    BigDecimal quote;
    Long position;
    BigDecimal saldoDisponible;
    BigDecimal cuentaContable;

}
