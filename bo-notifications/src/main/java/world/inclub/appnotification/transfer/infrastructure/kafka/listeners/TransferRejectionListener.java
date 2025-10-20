package world.inclub.appnotification.transfer.infrastructure.kafka.listeners;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;
import world.inclub.appnotification.shared.infrastructure.kafka.constants.KafkaConstants;
import world.inclub.appnotification.transfer.application.dto.TransferNotificationMessage;
import world.inclub.appnotification.transfer.application.service.TransferNotificationService;
import world.inclub.appnotification.transfer.infrastructure.email.adapters.TransferEmailBuilderAdapter;
import world.inclub.appnotification.transfer.infrastructure.kafka.constants.TransferKafkaConstants.Topic;
import world.inclub.appnotification.transfer.infrastructure.kafka.payload.TransferRejectionEnvelope;

import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class TransferRejectionListener {

    private final TransferNotificationService transferNotificationService;
    private final TransferEmailBuilderAdapter builderAdapter;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(topics = { Topic.REQUEST_SEND_NOTIFICATION }, groupId = KafkaConstants.GROUP_ID
            + "-rejection-envelope", containerFactory = "transferNotificationRawKafkaListenerContainerFactory")
    public void consumeRaw(String json, @Header(name = "kafka_receivedMessageKey", required = false) String key) {
        if (json == null || json.isBlank())
            return;
        try {
            log.info("[REJECTION-LISTENER] Received raw payload key={} length={}", key, json.length());
            JsonNode root = objectMapper.readTree(json);

            JsonNode data = root.path("data");
            if (data.isMissingNode() || data.isNull())
                data = root.path("body");
            if (data.isMissingNode() || data.isNull()) {
                try {
                    TransferRejectionEnvelope env = objectMapper.readValue(json, TransferRejectionEnvelope.class);
                    if (env != null && env.getData() != null) {
                        data = objectMapper.valueToTree(env.getData());
                    }
                } catch (Exception ignore) {
                }
            }
            if (data == null || data.isMissingNode() || data.isNull()) {
                log.debug("[REJECTION-LISTENER] No data/body node found. Skipping");
                return;
            }

            JsonNode tr = data.path("transferRequest");
            JsonNode rej = data.path("rejection");
            String statusTransfer = asText(data.get("status_transfer"));
            if (statusTransfer != null) {
                String st = statusTransfer.toUpperCase();
                boolean isRejected = st.contains("RECHAZ") || st.contains("REJECT") || st.equals("2")
                        || st.equals("2.0");
                if (!isRejected) {
                    log.debug("[REJECTION-LISTENER] status_transfer indicates non-rejected. Skipping");
                    return;
                }
            }
            if (tr.isMissingNode() || tr.isNull()) {
                log.debug("[REJECTION-LISTENER] transferRequest missing. Skipping");
                return;
            }

            Long idTransferRequest = asLong(tr.path("idTransferRequest"));
            Integer idTransferType = asInt(tr.path("idTransferType"));
            Long idMembership = asLong(tr.path("idMembership"));
            Long idUserFrom = asLong(tr.path("idUserFrom"));
            Long idUserTo = asLong(tr.path("idUserTo"));
            Long sponsorId = asLong(tr.path("sponsorId"));
            String userFromEmail = asText(tr.path("user_from_email"));
            String toEmail = asText(tr.path("user_to_correo_electronico"));
            String recipientEmail = asText(data.path("recipientEmail"));
            String targetEmail = firstNonBlank(userFromEmail, recipientEmail, toEmail);

            String newName = asText(tr.path("new_partner_name"), tr.path("user_to_nombre"));
            String newLast = asText(tr.path("new_partner_last_name"), tr.path("user_to_apellido"));
            String newDoc = asText(tr.path("user_to_numero_documento"));
            String fromFirst = asText(tr.path("user_from_nombre"));
            String fromLast = asText(tr.path("user_from_last_name"));
            String sponsorFirst = asText(tr.path("sponsor_nombre"), tr.path("sponsor_name"));
            String sponsorLast = asText(tr.path("sponsor_last_name"));
            String sponsorUsername = asText(tr.path("sponsor_username"));
            String usernameFrom = asText(tr.path("username_from"));
            String usernameTo = asText(tr.path("username_to"));

            LocalDateTime requestDate = parseDateTime(tr.get("requestDate"));
            LocalDateTime rejectedAt = parseDateTime(rej != null ? rej.get("rejectedTransferAt") : null);
            String rejectionReason = asText(rej != null ? rej.get("detailRejectionTransfer") : null);
            Integer rejectionTypeId = asInt(rej != null ? rej.get("idTransferRejectionType") : null);
            String rejectionTypeName = asText(rej != null ? rej.get("rejectionTypeName") : null);

            if (targetEmail == null || targetEmail.isBlank()) {
                log.warn("[REJECTION-LISTENER] No recipient email found in payload; skipping send.");
                return;
            }

            String nameMembership = asText(tr.path("nameMembership"));
            if (nameMembership == null || nameMembership.isBlank())
                nameMembership = asText(tr.path("name_membership"));
            if (nameMembership == null || nameMembership.isBlank())
                nameMembership = asText(tr.path("membershipName"));
            if ((nameMembership == null || nameMembership.isBlank()) && data != null)
                nameMembership = asText(data.path("nameMembership"));

            TransferNotificationMessage dto = TransferNotificationMessage.builder()
                    .id_transfer_request(idTransferRequest)
                    .id_transfer_status(3)
                    .id_transfer_type(idTransferType)
                    .id_membership(idMembership)
                    .id_user_from(idUserFrom)
                    .id_user_to(idUserTo)
                    .sponsor_id(sponsorId)
                    .user_to_correo_electronico(targetEmail)
                    .recipientEmail(targetEmail)
                    .user_to_nombre(newName)
                    .user_to_apellido(newLast)
                    .user_to_numero_documento(newDoc)
                    .user_from_nombre(fromFirst)
                    .user_from_last_name(fromLast)
                    .sponsor_nombre(sponsorFirst)
                    .sponsor_last_name(sponsorLast)
                    .sponsor_username(sponsorUsername)
                    .username_from(usernameFrom)
                    .username_to(usernameTo)
                    .request_date(requestDate)
                    .completion_date(rejectedAt)
                    .rejectionReason(rejectionReason)
                    .rejected_at(rejectedAt)
                    .rejectionTypeId(rejectionTypeId)
                    .rejectionTypeName(rejectionTypeName)
                    .nameMembership(nameMembership)
                    .build();

            String html = builderAdapter.buildHtml(dto);
            String subject = builderAdapter.getSubject();
            log.info("[REJECTION-LISTENER] Sending rejection email to={} subject={} htmlLength={} idReq={}",
                    targetEmail, subject, html == null ? 0 : html.length(), idTransferRequest);
            transferNotificationService.sendTransferNotification(dto, subject, html)
                    .subscribe(sent -> {
                        if (sent)
                            log.info("[REJECTION-LISTENER] Email sent to {}", targetEmail);
                        else
                            log.error("[REJECTION-LISTENER] Email NOT sent to {}", targetEmail);
                    });
        } catch (Exception e) {
            log.error("[REJECTION-LISTENER] Failed to process raw payload. key={} err={} json={} ", key, e.getMessage(),
                    json);
        }
    }

    private String asText(JsonNode... nodes) {
        if (nodes == null)
            return null;
        for (JsonNode n : nodes) {
            if (n == null)
                continue;
            if (!n.isMissingNode() && !n.isNull()) {
                String v = n.asText(null);
                if (v != null && !v.isBlank())
                    return v;
            }
        }
        return null;
    }

    private Integer asInt(JsonNode n) {
        if (n == null || n.isMissingNode() || n.isNull())
            return null;
        try {
            return n.asInt();
        } catch (Exception e) {
            return null;
        }
    }

    private Long asLong(JsonNode n) {
        if (n == null || n.isMissingNode() || n.isNull())
            return null;
        try {
            return n.asLong();
        } catch (Exception e) {
            return null;
        }
    }

    private LocalDateTime parseDateTime(JsonNode n) {
        if (n == null || n.isNull() || n.isMissingNode())
            return null;
        try {
            if (n.isArray() && n.size() >= 3) {
                int year = n.get(0).asInt();
                int month = n.get(1).asInt();
                int day = n.get(2).asInt();
                int hour = n.size() > 3 ? n.get(3).asInt() : 0;
                int minute = n.size() > 4 ? n.get(4).asInt() : 0;
                int second = n.size() > 5 ? n.get(5).asInt() : 0;
                return LocalDateTime.of(year, month, day, hour, minute, second);
            }
            String text = n.asText(null);
            if (text != null && !text.isBlank()) {
                return LocalDateTime.parse(text.replace("Z", ""));
            }
        } catch (Exception ignored) {
        }
        return null;
    }

    private String firstNonBlank(String... vals) {
        if (vals == null)
            return null;
        for (String v : vals) {
            if (v != null && !v.isBlank())
                return v;
        }
        return null;
    }
}
