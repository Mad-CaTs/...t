package world.inclub.transfer.liquidation.infraestructure.persistence;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.domain.entity.Payment;
import world.inclub.transfer.liquidation.domain.entity.PaymentLog;
import world.inclub.transfer.liquidation.domain.port.IPaymentLogPort;
import world.inclub.transfer.liquidation.domain.port.IPaymentPort;
import world.inclub.transfer.liquidation.infraestructure.repository.IPaymentLogRepository;

@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentLogAdapter implements IPaymentLogPort {

    private final IPaymentLogRepository paymentLogRepository;
    private final IPaymentPort paymentPort;

    @Override
    public Flux<PaymentLog> findByIdsuscription(Integer idsuscription) {
        return paymentLogRepository.findByIdsuscription(idsuscription);
    }

    @Override
    public Mono<PaymentLog> insert(PaymentLog paymentLog) {
    // Trace before attempting insert
    log.info("[PaymentLogAdapter] inserting payment_log for idPayment={} idsuscription={}", paymentLog.getIdPayment(), paymentLog.getIdSuscription());
    log.trace("[PaymentLogAdapter] payment_log payload: {}", paymentLog);
    return paymentLogRepository.insertSnapshot(
        paymentLog.getIdSuscription(),
        paymentLog.getIdPayment(),
        paymentLog.getQuoteDescription(),
        paymentLog.getNextExpiration(),
        paymentLog.getDollarExchange(),
        paymentLog.getQuotaUsd(),
        paymentLog.getPercentage(),
        paymentLog.getStatePaymentId(),
        paymentLog.getObs(),
        paymentLog.getPayDate(),
        paymentLog.getPts(),
        paymentLog.getIsQuoteInitial(),
        paymentLog.getPositionOnSchedule(),
        paymentLog.getNumberQuotePay(),
        paymentLog.getAmortizationUsd(),
        paymentLog.getCapitalBalanceUsd(),
        paymentLog.getTotalOverdue(),
        paymentLog.getPercentOverdueDetailId()
    )
        .doOnSuccess(pl -> log.info("[PaymentLogAdapter] inserted payment_log idPayment={} idsuscription={}", pl.getIdPayment(), pl.getIdSuscription()))
        .doOnError(err -> log.error("[PaymentLogAdapter] error inserting payment_log idPayment={} idsuscription={}", paymentLog.getIdPayment(), paymentLog.getIdSuscription(), err));
    }

    public Mono<PaymentLog> snapshotFromPayment(Integer idPayment) {
        return paymentPort.getFindById(idPayment)
                .switchIfEmpty(Mono.error(new IllegalArgumentException("Payment no encontrado: " + idPayment)))
                .flatMap(p -> {
                    PaymentLog paymentLog = fromPayment(p);
                    log.info("[snapshotFromPayment] creating snapshot from payment id={}", idPayment);
                    return insert(paymentLog)
                            .onErrorResume(err -> {
                                log.error("[snapshotFromPayment] error inserting snapshot for payment id={}: {}", idPayment, err.toString());
                                return Mono.empty();
                            });
                });
    }

    public Flux<PaymentLog> snapshotAllForSuscription(Integer idsuscription) {
        log.info("[PaymentLogAdapter] snapshotAllForSuscription start idsuscription={}", idsuscription);
        return paymentPort.findByIdsuscription(idsuscription)
                .flatMap(p -> {
                    PaymentLog paymentLog = fromPayment(p);
                    log.info("[snapshotAllForSuscription] snapshot payment id={} for subscription={}", p.getIdPayment(), idsuscription);
                    return insert(paymentLog)
                            .onErrorResume(err -> {
                                // Log per-payment insertion error but continue processing other payments
                                log.error("[PaymentLogAdapter] error inserting snapshot for payment id={} idsuscription={}: {}",
                                        p.getIdPayment(), idsuscription, err.toString());
                                return Mono.empty();
                            });
                })
                .doOnError(err -> log.error("[PaymentLogAdapter] error snapshotAllForSuscription idsuscription={}", idsuscription, err))
                .doOnComplete(() -> log.info("[PaymentLogAdapter] snapshotAllForSuscription completed idsuscription={}", idsuscription));
    }

    private PaymentLog fromPayment(Payment p) {
        PaymentLog log = new PaymentLog();
        log.setIdSuscription(p.getIdSuscription());
        log.setIdPayment(p.getIdPayment());
        log.setQuoteDescription(p.getQuoteDescription());
        log.setNextExpiration(p.getNextExpiration());
        log.setDollarExchange(p.getDollarExchange());
        log.setQuotaUsd(p.getQuotaUsd());
        log.setPercentage(p.getPercentage());
        log.setStatePaymentId(p.getStatePaymentId());
        log.setObs(p.getObs());
        log.setPayDate(p.getPayDate());
        log.setPts(p.getPts());
        log.setIsQuoteInitial(p.getIsQuoteInitial());
        log.setPositionOnSchedule(p.getPositionOnSchedule());
        log.setNumberQuotePay(p.getNumberQuotePay());
        log.setAmortizationUsd(p.getAmortizationUsd());
        log.setCapitalBalanceUsd(p.getCapitalBalanceUsd());
        log.setTotalOverdue(p.getTotalOverdue());
        log.setPercentOverdueDetailId(p.getPercentOverdueDetailId());
        return log;
    }
}
