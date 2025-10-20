package world.inclub.appnotification.transfer.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import world.inclub.appnotification.domain.port.IEmailPort;
import world.inclub.appnotification.transfer.application.dto.TransferNotificationMessage;

import javax.mail.MessagingException;
import java.io.UnsupportedEncodingException;

@Slf4j
@Service
@RequiredArgsConstructor
public class TransferNotificationServiceImpl implements TransferNotificationService {

    private final IEmailPort emailPort;

    @Override
    public Mono<Boolean> sendTransferNotification(TransferNotificationMessage message, String subject, String template) {
        return Mono.fromCallable(() -> {
            if (template == null || template.isBlank()) {
                log.warn("sendTransferNotification aborted: empty template for message: {}", message);
                return false;
            }

            if (message == null) {
                log.warn("sendTransferNotification aborted: null message");
                return false;
            }

            String recipient = null;
            try {
                recipient = message.user_to_correo_electronico() != null && !message.user_to_correo_electronico().isBlank()
                        ? message.user_to_correo_electronico()
                        : (message.recipientEmail() != null && !message.recipientEmail().isBlank() ? message.recipientEmail() : message.to());
            } catch (Exception ignored) {
            }

            if (recipient == null || recipient.isBlank()) {
                log.warn("sendTransferNotification aborted: missing recipient email in message: {}", message);
                return false;
            }

            try {
                emailPort.sendEmail(recipient, subject, template, null);
                log.info("EmailAdapter reported send to {}", recipient);
                return true;
            } catch (MessagingException | UnsupportedEncodingException e) {
                log.error("Error sending transfer notification email to {}: {}", recipient, e.getMessage(), e);
                return false;
            }
        });
    }
}
