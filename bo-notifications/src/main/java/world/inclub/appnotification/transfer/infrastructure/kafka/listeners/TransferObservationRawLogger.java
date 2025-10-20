package world.inclub.appnotification.transfer.infrastructure.kafka.listeners;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;
import world.inclub.appnotification.shared.infrastructure.kafka.constants.KafkaConstants;
import world.inclub.appnotification.transfer.application.dto.TransferNotificationMessage;
import world.inclub.appnotification.transfer.application.service.TransferNotificationService;
import world.inclub.appnotification.transfer.infrastructure.email.adapters.TransferEmailBuilderAdapter;

import java.time.LocalDateTime;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class TransferObservationRawLogger {

    private final TransferNotificationService transferNotificationService;
    private final TransferEmailBuilderAdapter builderAdapter;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(topics = { "transfer-observation" }, groupId = KafkaConstants.GROUP_ID
            + "-raw-debug", containerFactory = "transferNotificationRawKafkaListenerContainerFactory")
    public void consumeRaw(String json, @Header(name = "kafka_receivedMessageKey", required = false) String key) {
        if (json == null || json.isBlank())
            return;
        log.info("[OBSERVATION-LISTENER] listener registered for topic transfer-observation with group={}",
                KafkaConstants.GROUP_ID + "-raw-debug");
        try {
            log.info("[OBSERVATION-LISTENER] Received raw payload key={} length={}", key, json.length());
            try {
                log.debug("[OBSERVATION-LISTENER] payload-snippet={}",
                        json.length() > 200 ? json.substring(0, 200) : json);
            } catch (Exception ignored) {
            }
            JsonNode root = objectMapper.readTree(json);
            log.info("[OBSERVATION-LISTENER] parsed root JSON");
            java.util.List<String> rootKeys = new java.util.ArrayList<>();
            try {
                java.util.Iterator<String> rIt = root.fieldNames();
                while (rIt.hasNext())
                    rootKeys.add(rIt.next());
            } catch (Exception ignored) {
            }
            log.info("[OBSERVATION-LISTENER] root keys={}", rootKeys);

            JsonNode data = root.path("data");
            if (data.isMissingNode() || data.isNull())
                data = root.path("body");
            if (data == null || data.isMissingNode() || data.isNull()) {
                JsonNode found = findNodeWithTransferRequest(root);
                if (found != null) {
                    data = found;
                    log.info(
                            "[OBSERVATION-LISTENER] located transferRequest inside nested node; using that node as data");
                } else {
                    String[] candidates = new String[] { "transferRequest", "idTransferRequest", "id_transfer_request",
                            "idTransferStatus", "recipientEmail", "user_to_correo_electronico", "body" };
                    JsonNode any = findNodeWithAnyField(root, candidates);
                    if (any != null) {
                        data = any;
                        log.info(
                                "[OBSERVATION-LISTENER] located transfer-related node by key match; using that node as data");
                    }
                }
            }
            log.info("[OBSERVATION-LISTENER] located data/body node present={} textual={}",
                    !(data == null || data.isMissingNode() || data.isNull()), data != null && data.isTextual());
            try {
                if (data != null && !data.isMissingNode() && data.isTextual()) {
                    String inner = data.asText();
                    if (inner != null && !inner.isBlank()) {
                        JsonNode parsedInner = objectMapper.readTree(inner);
                        if (parsedInner != null && !parsedInner.isMissingNode())
                            data = parsedInner;
                        log.info("[OBSERVATION-LISTENER] parsed inner JSON from textual 'data' node");
                        try {
                            java.util.Iterator<String> it0 = data.fieldNames();
                            java.util.List<String> keys0 = new java.util.ArrayList<>();
                            while (it0.hasNext())
                                keys0.add(it0.next());
                            log.debug("[OBSERVATION-LISTENER] inner data keys={}", keys0);
                        } catch (Exception ignored) {
                        }
                    }
                }
            } catch (Exception ex) {
                log.debug("[OBSERVATION-LISTENER] failed to parse textual data node: {}", ex.getMessage());
            }
            if (data == null || data.isMissingNode() || data.isNull()) {
                log.debug("[OBSERVATION-LISTENER] No data/body node found. Skipping");
                return;
            }

            JsonNode tr = data.path("transferRequest");
            if ((tr == null || tr.isMissingNode() || tr.isNull())
                    && hasAnyField(data, "idTransferRequest", "id_transfer_request", "id_transfer_request",
                            "id_transfer_status", "user_to_correo_electronico", "user_from_email", "user_to_nombre")) {
                tr = data;
                log.info(
                        "[OBSERVATION-LISTENER] detected flat transferRequest fields at data level; treating data as transferRequest");
            }
            try {
                java.util.Iterator<String> it = data.fieldNames();
                java.util.List<String> keys = new java.util.ArrayList<>();
                while (it.hasNext())
                    keys.add(it.next());
                log.info("[OBSERVATION-LISTENER] data keys present={} transferRequestPresent={}", keys,
                        !tr.isMissingNode() && !tr.isNull());
            } catch (Exception ignore) {
            }

            if (tr.isMissingNode() || tr.isNull()) {
                log.warn(
                        "[OBSERVATION-LISTENER] transferRequest node missing inside data; raw json may have different shape. Skipping.");
                return;
            }
            JsonNode obs = data.path("observation");

            if (tr.isMissingNode() || tr.isNull()) {
                log.debug("[OBSERVATION-LISTENER] transferRequest missing. Skipping");
                return;
            }

            Long idTransferRequest = getLongFlex(tr, "idTransferRequest", "id_transfer_request", "transferRequestId");
            Integer idTransferType = getIntFlex(tr, "idTransferType", "id_transfer_type");
            Long idMembership = getLongFlex(tr, "idMembership", "id_membership");
            Long idUserFrom = getLongFlex(tr, "idUserFrom", "id_user_from");
            Long idUserTo = getLongFlex(tr, "idUserTo", "id_user_to");
            Long sponsorId = getLongFlex(tr, "sponsorId", "sponsor_id");
            String userFromEmail = getTextFlex(tr, "user_from_email", "userFromEmail", "user_from_email");
            String toEmail = getTextFlex(tr, "user_to_correo_electronico", "userToCorreoElectronico", "recipientEmail",
                    "to", "toUser");
            String recipientEmail = getTextFlex(data, "recipientEmail", "recipient_email", "recipient");
            String targetEmail = firstNonBlank(userFromEmail, recipientEmail, toEmail);

            String newName = firstNonBlank(getTextFlex(tr, "new_partner_name", "newPartnerName", "user_to_nombre"),
                    getTextFlex(tr, "user_to_nombre", "userToNombre"));
            String newLast = firstNonBlank(
                    getTextFlex(tr, "new_partner_last_name", "newPartnerLastName", "user_to_apellido"),
                    getTextFlex(tr, "user_to_apellido", "userToApellido"));
            String newDoc = getTextFlex(tr, "user_to_numero_documento", "nroDocument", "document");
            String fromFirst = getTextFlex(tr, "user_from_nombre", "userFromNombre");
            String fromLast = getTextFlex(tr, "user_from_last_name", "userFromLastName");
            String sponsorFirst = firstNonBlank(getTextFlex(tr, "sponsor_nombre", "sponsorName"),
                    getTextFlex(tr, "sponsor_name", "sponsorName"));
            String sponsorLast = getTextFlex(tr, "sponsor_last_name", "sponsorLastName");
            String sponsorUsername = getTextFlex(tr, "sponsor_username", "sponsorUsername");
            String usernameFrom = getTextFlex(tr, "username_from", "usernameFrom");
            String usernameTo = getTextFlex(tr, "username_to", "usernameTo");

            LocalDateTime requestDate = parseDateTime(tr.get("requestDate"));
            log.info("[OBSERVATION-LISTENER] transferRequest parsed: idTransferRequest={} idUserFrom={} idUserTo={}",
                    idTransferRequest, idUserFrom, idUserTo);
            LocalDateTime observedAt = parseDateTime(obs != null ? obs.get("observedTransferAt") : null);
            String observationDetail = firstNonBlank(
                    getTextFlex(obs, "detailObservationTransfer", "detail_observation_transfer", "detailObservation"),
                    getTextFlex(obs, "detail", "detailObservationTransfer"));
            Integer observationTypeId = getIntFlex(obs, "idTransferObservationType", "id_transfer_observation_type",
                    "idTransferObservationType");
            log.info("[OBSERVATION-LISTENER] observation parsed: typeId={} observedAt={} detailPresent={}",
                    observationTypeId, observedAt, observationDetail != null);

            if (targetEmail == null || targetEmail.isBlank()) {
                log.warn("[OBSERVATION-LISTENER] No recipient email found in payload; skipping send.");
                return;
            }

            String nameMembership = firstNonBlank(
                    getTextFlex(tr, "nameMembership", "name_membership", "name_memberhip", "membershipName"),
                    getTextFlex(data, "nameMembership", "name_membership", "membershipName"));

            TransferNotificationMessage dto = TransferNotificationMessage.builder()
                    .id_transfer_request(idTransferRequest)
                    .id_transfer_status(4)
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
                    .completion_date(observedAt)
                    .rejectionReason(observationDetail)
                    .rejected_at(observedAt)
                    .rejectionTypeId(observationTypeId)
                    .rejectionTypeName("OBSERVATION")
                    .nameMembership(nameMembership)
                    .build();
            log.info(
                    "[OBSERVATION-LISTENER] Parsed transferRequest.idTransferRequest={} idUserFrom={} idUserTo={} user_from_email={} user_to_correo={} observationTypeId={} observedAt={} observationDetail={}",
                    idTransferRequest, idUserFrom, idUserTo, userFromEmail, toEmail, observationTypeId, observedAt,
                    observationDetail);

            String html = builderAdapter.buildObservationHtml(dto);
            String subject = builderAdapter.getObservationSubject();
            if (html == null || html.isBlank()) {
                Map<String, Object> model = builderAdapter.getModelForMessage(dto);
                log.error(
                        "[OBSERVATION-LISTENER] Aborting send: rendered HTML is null/blank. recipient={} subject={} template=transfer/email_transfer_observation.ftl model={}",
                        targetEmail, subject, model);
            }
            log.info("[OBSERVATION-LISTENER] Sending observation email to={} subject={} htmlLength={} idReq={}",
                    targetEmail, subject, html == null ? 0 : html.length(), idTransferRequest);
            transferNotificationService.sendTransferNotification(dto, subject, html)
                    .subscribe(sent -> {
                        if (sent)
                            log.info("[OBSERVATION-LISTENER] Email sent to {}", targetEmail);
                        else
                            log.error("[OBSERVATION-LISTENER] Email NOT sent to {}", targetEmail);
                    });

        } catch (Exception e) {
            log.error("[OBSERVATION-LISTENER] Failed to process raw payload. key={} err={} json={}", key,
                    e.getMessage(), json);
        }
    }

    private JsonNode findNodeWithTransferRequest(JsonNode node) {
        if (node == null || node.isMissingNode() || node.isNull())
            return null;
        if (node.has("transferRequest"))
            return node;
        if (node.isObject()) {
            java.util.Iterator<java.util.Map.Entry<String, JsonNode>> fields = node.fields();
            while (fields.hasNext()) {
                java.util.Map.Entry<String, JsonNode> entry = fields.next();
                JsonNode found = findNodeWithTransferRequest(entry.getValue());
                if (found != null)
                    return found;
            }
        } else if (node.isArray()) {
            for (JsonNode el : node) {
                JsonNode found = findNodeWithTransferRequest(el);
                if (found != null)
                    return found;
            }
        }
        return null;
    }

    private JsonNode findNodeWithAnyField(JsonNode node, String[] keys) {
        if (node == null || node.isMissingNode() || node.isNull() || keys == null || keys.length == 0)
            return null;
        if (node.isObject()) {
            for (String k : keys) {
                if (k == null)
                    continue;
                if (node.has(k) || node.has(k.toLowerCase()))
                    return node;
            }
            java.util.Iterator<java.util.Map.Entry<String, JsonNode>> fields = node.fields();
            while (fields.hasNext()) {
                java.util.Map.Entry<String, JsonNode> entry = fields.next();
                JsonNode found = findNodeWithAnyField(entry.getValue(), keys);
                if (found != null)
                    return found;
            }
        } else if (node.isArray()) {
            for (JsonNode el : node) {
                JsonNode found = findNodeWithAnyField(el, keys);
                if (found != null)
                    return found;
            }
        }
        return null;
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

    private boolean hasAnyField(JsonNode node, String... keys) {
        if (node == null || keys == null)
            return false;
        for (String k : keys) {
            if (k == null)
                continue;
            if (node.has(k))
                return true;
            if (node.has(k.toLowerCase()))
                return true;
        }
        return false;
    }

    private String getTextFlex(JsonNode node, String... keys) {
        if (node == null || keys == null)
            return null;
        for (String k : keys) {
            if (k == null)
                continue;
            JsonNode n = node.get(k);
            if (n == null)
                n = node.get(k.toLowerCase());
            if (n != null && !n.isNull()) {
                String v = n.asText(null);
                if (v != null && !v.isBlank())
                    return v;
            }
        }
        return null;
    }

    private Integer getIntFlex(JsonNode node, String... keys) {
        if (node == null || keys == null)
            return null;
        for (String k : keys) {
            if (k == null)
                continue;
            JsonNode n = node.get(k);
            if (n == null)
                n = node.get(k.toLowerCase());
            if (n != null && !n.isNull()) {
                try {
                    return n.asInt();
                } catch (Exception ignored) {
                }
                try {
                    return Integer.valueOf(n.asText());
                } catch (Exception ignored) {
                }
            }
        }
        return null;
    }

    private Long getLongFlex(JsonNode node, String... keys) {
        if (node == null || keys == null)
            return null;
        for (String k : keys) {
            if (k == null)
                continue;
            JsonNode n = node.get(k);
            if (n == null)
                n = node.get(k.toLowerCase());
            if (n != null && !n.isNull()) {
                try {
                    return n.asLong();
                } catch (Exception ignored) {
                }
                try {
                    return Long.valueOf(n.asText());
                } catch (Exception ignored) {
                }
            }
        }
        return null;
    }
}
