package world.inclub.membershippayment.payPayment.aplication.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
import reactor.util.retry.Retry;
import world.inclub.membershippayment.aplication.dao.PaymentSuscriptionDao;
import world.inclub.membershippayment.domain.dto.WalletTransaction;
import world.inclub.membershippayment.domain.dto.request.CMeansPayment;
import world.inclub.membershippayment.domain.dto.response.RejectedSuscriptionResponse;

import java.math.BigDecimal;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AutoPaymentSuscriptionService {

    private final PaymentSuscriptionDao paymentSuscriptionDao;
    private final PayPaymentService payPaymentService;

    public Mono<List<Boolean>> getAllSuscriptionsPayment(String dateStart, String dateEnd) {

        ZoneId timeZone = ZoneId.of("America/Lima");
        LocalDateTime now = LocalDateTime.now(timeZone).truncatedTo(ChronoUnit.SECONDS);
        LocalDateTime tomorrow = now.plusDays(1);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        LocalDateTime dateInitial = dateStart != null ?
                LocalDateTime.parse(dateStart, formatter) :
                tomorrow.toLocalDate().atStartOfDay();

        LocalDateTime endDate = dateEnd != null ?
                LocalDateTime.parse(dateEnd, formatter) :
                tomorrow.toLocalDate().atTime(LocalTime.MAX).truncatedTo(ChronoUnit.SECONDS);

        log.info("Fecha de inicio: {}, Fecha final: {}",
                dateInitial.format(formatter),
                endDate.format(formatter));

        return paymentSuscriptionDao.gelAllSucriptionsPayment(dateInitial, endDate)
                .filter(this::isValidForPayment)
                .concatMap(payment -> processPaymentSequentially(payment))
                .collectList()
                .doOnSuccess(processed ->
                        log.info("Procesados {} pagos exitosamente", processed.size()))
                .doOnError(error ->
                        log.error("Error en el procesamiento de pagos: {}", error.getMessage()));
    }

    private Mono<Boolean> processPaymentSequentially(RejectedSuscriptionResponse payment) {
        return Mono.defer(() -> {
            try {
                CMeansPayment paymentBody = createPaymentRequest(payment);
                log.info("Procesando pago secuencial para suscripción: {}", payment.idSuscription());

                return payPaymentService.PayPaymentSuscription(paymentBody)
                        .timeout(Duration.ofSeconds(30))
                        .retryWhen(Retry.backoff(3, Duration.ofSeconds(1))
                                .doBeforeRetry(retrySignal ->
                                        log.warn("Reintentando pago para suscripción: {}, intento: {}",
                                                payment.idSuscription(), retrySignal.totalRetries() + 1))
                                .onRetryExhaustedThrow((retryBackoffSpec, retrySignal) ->
                                        new RuntimeException("Máximo de reintentos alcanzado para suscripción: " + payment.idSuscription())))
                        .doOnSuccess(response ->
                                log.info("Pago exitoso para suscripción: {}", payment.idSuscription()))
                        .doOnError(error ->
                                log.error(" Error en pago para suscripción {}: {}",
                                        payment.idSuscription(), error.getMessage()))
                        .onErrorResume(error -> {
                            // Puedes decidir si retornar Mono.empty() o Mono.error según tu necesidad
                            log.error("Omitiendo pago fallido para suscripción: {}", payment.idSuscription());
                            return Mono.empty();
                        });
            } catch (Exception e) {
                log.error("Error creando request de pago para suscripción {}: {}",
                        payment.idSuscription(), e.getMessage());
                return Mono.empty();
            }
        });
    }
    // Métodos auxiliares corregidos
    private boolean isValidForPayment(RejectedSuscriptionResponse payment) {
        BigDecimal quote = payment.quote() != null ? payment.quote() : BigDecimal.ZERO;
        BigDecimal balance = payment.saldoDisponible() != null ? payment.saldoDisponible() : BigDecimal.ZERO;
        return quote.compareTo(balance) <= 0;
    }

    private CMeansPayment createPaymentRequest(RejectedSuscriptionResponse payment) {
        WalletTransaction walletTransaction = new WalletTransaction();
        walletTransaction.setAmount(payment.quote() != null ? payment.quote() : BigDecimal.ZERO);

        BigDecimal quote = payment.quote() != null ? payment.quote() : BigDecimal.ZERO;

        CMeansPayment paymentBody = new CMeansPayment();
        paymentBody.setIdPayment(payment.idPayment().intValue());
        paymentBody.setIdUserPayment(payment.idUser().intValue());
        paymentBody.setTypeMethodPayment(4);
        paymentBody.setAmountPaidPayment(quote);
        paymentBody.setNumberPaymentInitials(0);
        paymentBody.setNumberAdvancePaymentPaid(0);
        paymentBody.setPaypalDTO(null);
        paymentBody.setIsGracePeriodApplied(false);
        paymentBody.setTypePercentOverdue(0);
        paymentBody.setTotalOverdue(BigDecimal.ZERO);
        paymentBody.setIdPercentOverdueDetail(0);
        paymentBody.setListaVouches(new ArrayList<>());
        paymentBody.setWalletTransaction(walletTransaction);

        return paymentBody;
    }



}
