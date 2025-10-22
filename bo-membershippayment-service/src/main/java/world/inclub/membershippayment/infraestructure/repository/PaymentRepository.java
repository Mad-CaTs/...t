package world.inclub.membershippayment.infraestructure.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.domain.entity.Payment;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentRepository extends ReactiveCrudRepository<Payment, Long> {


    @Query("SELECT * FROM bo_membership.payment WHERE idsuscription = :idSuscription")
    Flux<Payment> getAllPaymentsByIdSubscription(@Param("idSuscription") int idSuscription);


    Flux<Payment> findAllByIdSuscription(Integer idSubscription);

    @Query("""
            UPDATE bo_membership.payment
                SET totaloverdue= :total, idpercentoverduedetail= :idperncet
            WHERE idpayment= :id ;
            """)
    Mono<Payment> putPaymentOverdue(@Param("id") Long id, @Param("idperncet") Integer percentoverduedetailid,
                                    @Param("total") BigDecimal totalOverdue);

    // Metodo personalizado para eliminar por idsuscription
    Mono<Void> deleteByIdSuscriptionAndIdStatePayment(Integer idsuscription, Integer idState);

    Flux<Payment> findAllByIdSuscriptionAndIdStatePaymentNot(Integer idSuscription, Integer idStatePayment);


    @Query("DELETE FROM bo_membership.payment WHERE idpayment = :idPayment")
    Mono<Void> deleteByIdPayment(@Param("idPayment") Long idPayment);

    Mono<Boolean> existsByIdSuscriptionAndIsInitialQuoteAndIdStatePayment(Integer idSuscription, Integer isInitialQuote, Integer idStatePayment);

    @Query(value = """
            WITH OrderedPayments AS (
                SELECT * 
                FROM bo_membership.payment p
                WHERE p.idsuscription = :idSuscription
                ORDER BY p.positiononschedule ASC
            )
            SELECT COUNT(*) = 12
            FROM (
                SELECT idstatepayment
                FROM OrderedPayments
                WHERE isinitialquote = 0
                LIMIT 12
            ) subquery
            WHERE idstatepayment = 1
            """)
    Mono<Boolean> hasFirst12PaymentsStateOne(@Param("idSuscription") Integer idSuscription);


    @Query("SELECT * FROM bo_membership.payment " +
            "WHERE idsuscription = :idSuscription AND idstatepayment != 1 " +
            "ORDER BY positiononschedule LIMIT 1")
    Mono<Payment> findFirstUnpaidByIdSuscriptionAndIdStatePaymentNot(
            @Param("idSuscription") Long idSuscription);

    @Query("SELECT count(1) FROM bo_membership.payment " +
            "WHERE idsuscription = :idSuscription AND idstatepayment = :idstatepayment")
    Mono<Integer> getTotalPayments(@Param("idSuscription") Integer idSuscription, @Param("idstatepayment") Integer idstatepayment);

    @Query("""
            SELECT * FROM bo_membership.payment 
            WHERE idstatepayment = 0 
            AND nextexpirationdate  = :fecha 
            ORDER BY positiononschedule
    """)
    Flux<Payment> findPaymentsDueToday(@Param("fecha") String fecha);

    @Query("""
            SELECT * FROM bo_membership.payment 
            WHERE idsuscription IN (:subscriptionIds) 
            AND idstatepayment = 1 
            AND paydate IS NOT NULL
            ORDER BY paydate DESC 
            LIMIT 1
    """)
    Mono<Payment> findLastPaymentBySubscriptions(@Param("subscriptionIds") List<Integer> subscriptionIds);

    @Query("""
            SELECT * FROM bo_membership.payment 
            WHERE idsuscription IN (:subscriptionIds) 
            AND idstatepayment = 0
            ORDER BY positiononschedule 
            LIMIT 1
    """)
    Mono<Payment> findNextPaymentBySubscriptions(@Param("subscriptionIds") List<Integer> subscriptionIds);
}
