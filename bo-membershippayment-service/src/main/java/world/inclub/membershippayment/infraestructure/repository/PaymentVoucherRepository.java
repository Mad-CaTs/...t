package world.inclub.membershippayment.infraestructure.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.domain.entity.PaymentVoucher;

@Repository
public interface PaymentVoucherRepository extends ReactiveCrudRepository<PaymentVoucher, Long> {
    Flux<PaymentVoucher> findByIdSuscription(Integer idSuscription);

    @Query("DELETE FROM bo_membership.paymentvoucher WHERE idpayment = :idPayment")
    Mono<Void> deleteByIdPayment(@Param("idPayment") Integer idPayment);

    @Query("DELETE FROM bo_membership.paymentvoucher WHERE idpaymentvoucher = :idpaymentvoucher")
    Mono<Void> deleteByIdPaymentVoucher(@Param("idpaymentvoucher") Integer idpaymentvoucher);
}
