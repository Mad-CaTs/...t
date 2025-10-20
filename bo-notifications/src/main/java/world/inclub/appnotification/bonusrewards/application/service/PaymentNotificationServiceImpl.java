package world.inclub.appnotification.bonusrewards.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import world.inclub.appnotification.bonusrewards.application.dto.PaymentNotificationMessage;
import world.inclub.appnotification.domain.port.IEmailPort;

import javax.mail.MessagingException;
import java.io.UnsupportedEncodingException;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentNotificationServiceImpl implements PaymentNotificationService {

    private final IEmailPort emailPort;

    @Override
    public Mono<Boolean> sendPaymentNotification(PaymentNotificationMessage message, String subject, String template) {
        return Mono.fromCallable(() -> {
            try {
                emailPort.sendEmail(message.user().email(), subject, template, null);
                return true;
            } catch (MessagingException | UnsupportedEncodingException e) {
                log.error("Error sending password recovery email to {}: {}", message.user().email(), e.getMessage());
                return false;
            }
        });
    }

}