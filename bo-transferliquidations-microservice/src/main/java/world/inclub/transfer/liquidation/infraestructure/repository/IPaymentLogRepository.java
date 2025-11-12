package world.inclub.transfer.liquidation.infraestructure.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.domain.entity.PaymentLog;

public interface IPaymentLogRepository extends ReactiveCrudRepository<PaymentLog, Integer> {

    @Query("SELECT * FROM bo_transfer_liquidation.payment_log WHERE idsuscription = $1 ORDER BY id_payment_log DESC")
    Flux<PaymentLog> findByIdsuscription(Integer idsuscription);

    @Query("INSERT INTO bo_transfer_liquidation.payment_log(\n" +
            " idsuscription, idpayment, quotedescription, nextexpiration, dollarexchange, quotausd, percentage, statepaymentid, obs, paydate, pts, isquoteinitial, positiononschedule, numberquotepay, amortizationusd, capitalbalanceusd, totaloverdue, percentoverduedetailid)\n" +
            " VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) RETURNING *")
    Mono<PaymentLog> insertSnapshot(Integer idsuscription, Integer idpayment, String quotedescription,
                                    java.time.LocalDateTime nextexpiration, java.math.BigDecimal dollarexchange,
                                    java.math.BigDecimal quotausd, java.math.BigDecimal percentage, Integer statepaymentid,
                                    String obs, java.time.LocalDateTime paydate, java.math.BigDecimal pts,
                                    Integer isquoteinitial, Integer positiononschedule, Integer numberquotepay,
                                    java.math.BigDecimal amortizationusd, java.math.BigDecimal capitalbalanceusd,
                                    java.math.BigDecimal totaloverdue, Integer percentoverduedetailid);
}
