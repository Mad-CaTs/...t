package world.inclub.membershippayment.aplication.dao;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.domain.entity.Payment;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface PaymentDao {


    Flux<Payment> getAllPaymentsByIdSubscription(int idSuscription);

    Mono<List<Payment>> postPayments(List<Payment> payments);

    Mono<Payment> getPaymentById(Long id);

    Flux<Payment> getAllPaymentsByIdSubscription(Integer idSubscription);

    Flux<Payment> getAllPaymentsAndMoraByIdSubscription(Integer idSubscription);

    Mono<Payment> putPayment(Payment payment);

    Mono<Payment> putPaymentWithId(Payment payment);

    Mono<Payment> putPaymentOverdue(Payment payment, Integer idPercentOverdueDetail, BigDecimal totalOverdue);

    Mono<Boolean> putScheduleExpirationDate(Payment payment, LocalDateTime newExpiration);

    Mono<Boolean> existsPaymentWithInitialQuotePayed(Integer suscriptionId);

    Mono<Boolean> hasFirst12PaymentsStateOne(Integer suscriptionId);

    //Uso en Migra
    Mono<Boolean> deleteScheduleByIdSuscription(Integer idSuscription);

    //Uso Exclusivo para el proceso de migracion para no chocar con la ForengeKey de Voucher
    Mono<Boolean> updateScheduleStatusTemporal(Integer idSuscription);

    //Uso Exclusivo para el proceso de migracion
    Mono<List<Payment>> postPaymentsForMigration(List<Payment> payments);

    Mono<Void> deletePaymentById(Long idPayment);

    Mono<Boolean> isMigratedCommission(Integer idSuscription);

    Mono<Payment> findFirstUnpaidByIdSuscriptionAndIdStatePayment(Integer idSuscription);

    Flux<Payment> getPaymentsDueToday(String fecha);

    // 🚀 NUEVO: Obtener último pago por lista de suscripciones
    Mono<Payment> getLastPaymentBySubscriptions(List<Integer> subscriptionIds);

    // 🚀 NUEVO: Obtener próximo pago por lista de suscripciones
    Mono<Payment> getNextPaymentBySubscriptions(List<Integer> subscriptionIds);
}
