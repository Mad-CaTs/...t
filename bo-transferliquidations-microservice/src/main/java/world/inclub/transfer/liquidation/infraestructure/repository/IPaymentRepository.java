package world.inclub.transfer.liquidation.infraestructure.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.domain.entity.Payment;

public interface IPaymentRepository extends ReactiveCrudRepository<Payment, Long> {
    @Query("SELECT * FROM bo_membership.payment WHERE idpayment = :idpayment")
    Mono<Payment> getFindById(@Param("idpayment") Integer idpayment );

    @Query("SELECT * FROM bo_membership.payment WHERE idsuscription = :idsuscription ORDER BY idpayment DESC")
    Flux<Payment> findByIdsuscription(@Param("idsuscription") Integer idsuscription);
}
