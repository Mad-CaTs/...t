package world.inclub.appnotification.transfer.infrastructure.kafka.payload;

import lombok.Builder;
import lombok.Getter;

import java.time.Instant;

@Getter
@Builder
public class TransferActionMessage {
    private Long id_transfer_request;
    private String action; // "ACCEPTED" or "REJECTED"
    private String recipientEmail;
    private String user_to_nombre;
    private String user_to_apellido;
    private String user_from_email;
    private String user_from_nombre;
    private String user_from_apellido;
    private Instant occurredAt;
    private String actor;
}
