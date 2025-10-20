package world.inclub.appnotification.transfer.infrastructure.kafka.producer;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import world.inclub.appnotification.transfer.infrastructure.kafka.payload.TransferActionMessage;
import world.inclub.appnotification.transfer.infrastructure.kafka.constants.TransferKafkaConstants.Topic;

import java.time.Instant;

@Component
@RequiredArgsConstructor
public class TransferKafkaProducer {

    private final KafkaTemplate<String, TransferActionMessage> kafkaTemplate;

    public void publishAccepted(Long id, String recipientEmail, String firstName, String lastName) {
        TransferActionMessage msg = TransferActionMessage.builder()
                .id_transfer_request(id)
                .action("ACCEPTED")
                .recipientEmail(recipientEmail)
                .user_to_nombre(firstName)
                .user_to_apellido(lastName)
                .occurredAt(Instant.now())
                .actor("email-cta")
                .build();
        kafkaTemplate.send(Topic.REQUEST_SEND_NOTIFICATION, id == null ? null : String.valueOf(id), msg);
        System.out.println("[KAFKA-PUBLISH] ACCEPTED -> id=" + id + " email=" + recipientEmail + " first=" + firstName + " last=" + lastName);
    }

    public void publishRejected(Long id, String recipientEmail, String firstName, String lastName, String userFromEmail, String userFromNombre, String userFromApellido) {
        TransferActionMessage.TransferActionMessageBuilder builder = TransferActionMessage.builder()
                .id_transfer_request(id)
                .action("REJECTED")
                .recipientEmail(recipientEmail)
                .user_to_nombre(firstName)
                .user_to_apellido(lastName)
                .occurredAt(Instant.now())
                .actor("email-cta");
        if (userFromEmail != null) builder.user_from_email(userFromEmail);
        if (userFromNombre != null) builder.user_from_nombre(userFromNombre);
        if (userFromApellido != null) builder.user_from_apellido(userFromApellido);
        TransferActionMessage msg = builder.build();
        kafkaTemplate.send(Topic.REQUEST_SEND_NOTIFICATION, id == null ? null : String.valueOf(id), msg);
        System.out.println("[KAFKA-PUBLISH] REJECTED -> id=" + id + " email=" + recipientEmail + " userFrom=" + userFromEmail + " first=" + firstName + " last=" + lastName);
    }
}
