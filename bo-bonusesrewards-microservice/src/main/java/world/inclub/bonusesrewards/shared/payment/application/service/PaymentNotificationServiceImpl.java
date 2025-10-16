package world.inclub.bonusesrewards.shared.payment.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.payment.application.service.interfaces.PaymentNotificationService;
import world.inclub.bonusesrewards.shared.payment.domain.model.Payment;
import world.inclub.bonusesrewards.shared.payment.domain.model.PaymentRejection;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentNotificationServiceImpl implements PaymentNotificationService {

    @Override
    public Mono<Void> sendPaymentNotification(Payment payment) {
        return Mono.empty();
    }

    @Override
    public Mono<Void> sendPaymentRejectionNotification(Payment payment, PaymentRejection rejection) {
        return Mono.empty();
    }
}
