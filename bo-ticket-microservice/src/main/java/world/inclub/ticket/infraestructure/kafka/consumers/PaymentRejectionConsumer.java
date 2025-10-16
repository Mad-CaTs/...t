package world.inclub.ticket.infraestructure.kafka.consumers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import world.inclub.ticket.infraestructure.kafka.topics.PaymentRejectedEvent;
import world.inclub.ticket.application.service.interfaces.FinalizeRejectedPaymentUseCase;
import world.inclub.ticket.utils.TimeLima;
import world.inclub.ticket.infraestructure.config.constants.Constants;

import java.time.Duration;
import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class PaymentRejectionConsumer {

    private final FinalizeRejectedPaymentUseCase finalizeRejectedPaymentUseCase;

    @KafkaListener(
        topics = "topic-payment-rejected", 
        groupId = "ticket-group-222",
        containerFactory = "kafkaListenerContainerFactory"
    )
    public void handlePaymentRejectedEvent(PaymentRejectedEvent event) {
        log.info("Processing payment rejected event for payment ID: {}", event.getPaymentId());
        
        // Programar el timeout después de 30 minutos
        schedulePaymentTimeout(event);
    }

    private void schedulePaymentTimeout(PaymentRejectedEvent event) {
        // Usar un scheduler reactivo para programar el timeout
        reactor.core.scheduler.Schedulers.boundedElastic()
                .schedule(() -> checkAndFinalizeRejection(event), 
                         Constants.Payment.MODIFICATION_WINDOW_MINUTES, java.util.concurrent.TimeUnit.MINUTES);
    }

    private void checkAndFinalizeRejection(PaymentRejectedEvent event) {
        LocalDateTime now = TimeLima.getLimaTime();
        Duration timeElapsed = Duration.between(event.getRejectedAt(), now);
        
        if (timeElapsed.toMinutes() >= Constants.Payment.MODIFICATION_WINDOW_MINUTES) {
            log.info("Finalizing rejected payment {} after {} minutes", event.getPaymentId(), timeElapsed.toMinutes());
            
            // MEJORA: Usar el mismo reasonId y detail del rechazo temporal en lugar de valores hardcodeados
            // Esto mantiene la consistencia en el historial de rechazos y permite un mejor tracking
            String originalDetail = event.getDetail() != null ? event.getDetail() : "Sin detalles";
            String timeoutDetail = originalDetail + " (Finalizado automáticamente después de " + 
                                 Constants.Payment.MODIFICATION_WINDOW_MINUTES + " minutos sin modificación)";
            
            finalizeRejectedPaymentUseCase.finalizeRejectedPayment(
                event.getPaymentId(),
                event.getReasonId(), // Usar el mismo reasonId del rechazo temporal
                timeoutDetail
            )
            .doOnSuccess(result -> log.info("Payment {} finalized successfully with reasonId: {}", event.getPaymentId(), event.getReasonId()))
            .doOnError(error -> log.error("Error finalizing payment {}: {}", event.getPaymentId(), error.getMessage()))
            .subscribe();
        } else {
            log.info("Payment {} still within modification window", event.getPaymentId());
        }
    }

}
