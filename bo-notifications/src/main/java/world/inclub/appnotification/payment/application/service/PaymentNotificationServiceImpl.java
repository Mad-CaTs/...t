package world.inclub.appnotification.payment.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import world.inclub.appnotification.domain.port.IEmailPort;
import world.inclub.appnotification.payment.application.dto.TicketPaymentNotificationMessage;

import javax.mail.MessagingException;
import java.io.UnsupportedEncodingException;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentNotificationServiceImpl implements PaymentNotificationService {

    private final IEmailPort emailPort;

    @Override
    public Mono<Boolean> sendTicketPaymentNotification(TicketPaymentNotificationMessage message, String subject, String template) {
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
