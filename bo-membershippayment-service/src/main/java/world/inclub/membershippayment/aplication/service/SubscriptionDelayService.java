package world.inclub.membershippayment.aplication.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

import java.time.temporal.ChronoUnit;

import org.springframework.stereotype.Service;

import world.inclub.membershippayment.domain.dto.request.SubscriptionDelayRequest;
import world.inclub.membershippayment.domain.entity.SubscriptionDelay;
import world.inclub.membershippayment.infraestructure.repository.SubscriptionDelayRepository;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubscriptionDelayService {

    private final SubscriptionDelayRepository subscriptionDelayRepository;

    public Mono<Boolean> calculateAndSavePaymentDelay(SubscriptionDelayRequest request) {
        if (request.getPaymentDate() != null && request.getExpirationDate() != null) {
            // Verificar si el pago se realizó después de la fecha de vencimiento
            if (request.getPaymentDate().isAfter(request.getExpirationDate())) {
                long daysOfDelay = ChronoUnit.DAYS.between(request.getExpirationDate(), request.getPaymentDate());

                if (daysOfDelay == 0) {
                    // log.info("El pago se realizó el mismo día de la fecha de vencimiento, no se guardará información de retraso");
                    return Mono.just(false);
                }

                return subscriptionDelayRepository.existsByIdPaymentAndIdSubscription(request.getIdPayment(), request.getIdSubscription())
                        .flatMap(exists -> {
                            if (exists) {
                                // log.info("Ya existe información de retraso para la suscripción {} y pago {}", request.getIdSubscription(), request.getIdPayment());
                                return Mono.just(false);
                            } else {

                                // log.info("Pago retrasado por {} días para la suscripción {}", daysOfDelay, request.getIdSubscription());
                                SubscriptionDelay delay = SubscriptionDelay.builder()
                                        .idPayment(request.getIdPayment())
                                        .idSubscription(request.getIdSubscription())
                                        .days((int) daysOfDelay)
                                        .paymentDate(request.getPaymentDate())
                                        .build();

                                return subscriptionDelayRepository.save(delay)
                                        .map(savedDelay -> true)
                                        .doOnSuccess(result -> log.info("Información de retraso guardada exitosamente para la suscripción {}", request.getIdSubscription()))
                                        .doOnError(error -> log.error("Error al guardar información de retraso para la suscripción {}: {}",
                                                request.getIdSubscription(), error.getMessage()));
                            }
                        });
            } else {
                // log.info("Sin retraso para la suscripción {}, pago realizado a tiempo", request.getIdSubscription());
                return Mono.just(false);
            }
        }
        return Mono.error(new IllegalArgumentException("Payment date and expiration date cannot be null"));
    }

}
