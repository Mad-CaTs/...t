package world.inclub.appnotification.transfer.infrastructure.kafka.listeners;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import world.inclub.appnotification.transfer.application.dto.TransferNotificationMessage;
import world.inclub.appnotification.transfer.infrastructure.kafka.payload.ProducerTransferBody;
import world.inclub.appnotification.transfer.application.service.TransferNotificationService;
import world.inclub.appnotification.transfer.infrastructure.email.adapters.TransferEmailBuilderAdapter;
import world.inclub.appnotification.transfer.infrastructure.kafka.constants.TransferKafkaConstants.Topic;
import world.inclub.appnotification.shared.infrastructure.kafka.constants.KafkaConstants;

@Slf4j
@Component
@RequiredArgsConstructor
public class TransferNotificationConsumerListener {

    private final TransferNotificationService transferNotificationService;
    private final TransferEmailBuilderAdapter transferEmailBuilderAdapter;

    @KafkaListener(
        topics = { Topic.REQUEST_SEND_NOTIFICATION, Topic.REQUEST_SEND_NOTIFICATION_LEGACY },
        groupId = KafkaConstants.GROUP_ID,
        containerFactory = "transferNotificationKafkaListenerContainerFactory"
    )
    public void consume(ProducerTransferBody payload) {
        log.debug("TransferNotificationConsumerListener.consume invoked.");
        if (payload == null) return;
        try {
            com.fasterxml.jackson.databind.ObjectMapper om = new com.fasterxml.jackson.databind.ObjectMapper();
            log.info("[DESERIALIZED-PAYLOAD] {}", om.writeValueAsString(payload));
            try { log.info("[PAYLOAD-DEBUG] username_child='{}' username_to='{}' childId='{}'", payload.getUsername_child(), payload.getUsername_to(), payload.getChildId()); } catch (Throwable ignored) {}
        } catch (Exception ignore) {}
        try {
            String topLastName = payload.getUser_to_apellido();
            String topDocumento = payload.getUser_to_numero_documento();
            String bodyToUser = payload.getTo();
            String bodyFromUser = payload.getFromUser();
            log.info("[FIELD-DEBUG] user_to_apellido='{}' user_to_numero_documento='{}' toUser='{}' fromUser='{}'",
                topLastName, topDocumento, bodyToUser, bodyFromUser);
        } catch (Exception e) {
            log.warn("Error printing field-level debug: {}", e.getMessage());
        }
        try {
            java.util.Map<String,Object> nested = null;
            try { nested = payload.getBody(); } catch (Throwable ignore) {}
            if (nested != null) {
                log.info("[NESTED-BODY-KEYS] {}", nested.keySet());
            } else {
                log.info("[NESTED-BODY-KEYS] <none>");
            }
        } catch (Exception e) {
            log.debug("Error checking nested body: {}", e.getMessage());
        }
    String bodyRecipient = payload.getRecipientEmail();
    String bodyTo = payload.getTo();
        String effectiveEmail = payload.getEffectiveEmail();
        log.info("Transfer payload keys: id_transfer_request={} id_detail_transfer={} user_to_correo_electronico={} email={} recipientEmail={} body.recipientEmail={} body.to={} -> effectiveEmail={}",
            payload.getId_transfer_request(),
            payload.getId_detail_transfer(),
            payload.getUser_to_correo_electronico(),
            null,
            payload.getRecipientEmail(),
            bodyRecipient,
            bodyTo,
            effectiveEmail);

        if (effectiveEmail == null || effectiveEmail.isBlank()) {
            try {
                java.util.Map<String, Object> b = payload.getBody();
                if (b != null && b.get("transferRequest") instanceof java.util.Map<?,?> tr) {
                    Object fromEmail = ((java.util.Map<?,?>) tr).get("user_from_email");
                    Object toEmail = ((java.util.Map<?,?>) tr).get("user_to_correo_electronico");
                    if (fromEmail != null && !fromEmail.toString().isBlank()) effectiveEmail = fromEmail.toString();
                    else if (toEmail != null && !toEmail.toString().isBlank()) effectiveEmail = toEmail.toString();
                }
            } catch (Exception ignore) {}
            if (effectiveEmail == null || effectiveEmail.isBlank()) {
                log.warn("Ignoring payload because it lacks recipient email: {}", payload);
                return;
            }
        }

        TransferNotificationMessage baseMessage = payload.toTransferNotificationMessage();
    try { log.info("[BASE-MESSAGE] username_child='{}' username_to='{}'", baseMessage.username_child(), baseMessage.username_to()); } catch (Throwable ignored) {}
        try {
            java.util.Map<String,Object> b = payload.getBody();
            if (b != null && b.get("observation") instanceof java.util.Map<?,?> obs) {
                Object detail = ((java.util.Map<?,?>) obs).get("detailObservationTransfer");
                if (detail == null) detail = ((java.util.Map<?,?>) obs).get("detail");
                Object typeId = ((java.util.Map<?,?>) obs).get("idTransferObservationType");
                if (detail != null) {
                    baseMessage = TransferNotificationMessage.builder()
                        .id_transfer_request(baseMessage.id_transfer_request())
                        .id_transfer_status(baseMessage.id_transfer_status())
                        .id_transfer_type(baseMessage.id_transfer_type())
                        .id_membership(baseMessage.id_membership())
                        .id_user_from(baseMessage.id_user_from())
                        .id_user_to(baseMessage.id_user_to())
                        .sponsor_id(baseMessage.sponsor_id())
                        .id_detail_transfer(baseMessage.id_detail_transfer())
                        .transferRequestId(baseMessage.transferRequestId())
                        .toUser(baseMessage.toUser())
                        .fromUser(baseMessage.fromUser())
                        .dniUrl(baseMessage.dniUrl())
                        .declarationJuradaUrl(baseMessage.declarationJuradaUrl())
                        .dni_solicitante(baseMessage.dni_solicitante())
                        .declaracion_jurada(baseMessage.declaracion_jurada())
                        .dni_receptor(baseMessage.dni_receptor())
                        .recipientEmail(baseMessage.recipientEmail())
                        .to(baseMessage.to())
                        .user_to_nombre(baseMessage.user_to_nombre())
                        .user_to_apellido(baseMessage.user_to_apellido())
                        .user_to_numero_documento(baseMessage.user_to_numero_documento())
                        .user_to_tipo_documento(baseMessage.user_to_tipo_documento())
                        .user_to_genero(baseMessage.user_to_genero())
                        .user_to_celular(baseMessage.user_to_celular())
                        .user_from_nombre(baseMessage.user_from_nombre())
                        .user_from_last_name(baseMessage.user_from_last_name())
                        .username_from(baseMessage.username_from())
                        .username_child(baseMessage.username_child())
                        .sponsor_username(baseMessage.sponsor_username())
                        .sponsor_nombre(baseMessage.sponsor_nombre())
                        .sponsor_last_name(baseMessage.sponsor_last_name())
                        .username_to(baseMessage.username_to())
                        .childId(baseMessage.childId())
                        .request_date(baseMessage.request_date())
                        .approval_date(baseMessage.approval_date())
                        .completion_date(baseMessage.completion_date())
                        .user_to_correo_electronico(baseMessage.user_to_correo_electronico())
                        .rejectionReason(detail == null ? baseMessage.rejectionReason() : detail.toString())
                        .rejected_at(baseMessage.rejected_at())
                        .rejectionTypeId(typeId == null ? baseMessage.rejectionTypeId() : (typeId instanceof Number ? ((Number)typeId).intValue() : Integer.valueOf(typeId.toString())))
                        .rejectionTypeName(baseMessage.rejectionTypeName() == null ? "OBSERVATION" : baseMessage.rejectionTypeName())
                        .nameMembership(baseMessage.nameMembership())
                        .build();
                }
            }
        } catch (Exception ignored) {}
        TransferNotificationMessage finalMessage = TransferNotificationMessage.builder()
            .id_transfer_request(baseMessage.id_transfer_request())
            .id_transfer_status(baseMessage.id_transfer_status())
            .id_transfer_type(baseMessage.id_transfer_type())
            .id_membership(baseMessage.id_membership())
            .id_user_from(baseMessage.id_user_from())
            .id_user_to(baseMessage.id_user_to())
            .sponsor_id(baseMessage.sponsor_id())
            .id_detail_transfer(baseMessage.id_detail_transfer())
            .transferRequestId(baseMessage.transferRequestId())
            .toUser(baseMessage.toUser())
            .fromUser(baseMessage.fromUser())
            .dniUrl(baseMessage.dniUrl())
            .declarationJuradaUrl(baseMessage.declarationJuradaUrl())
            .dni_solicitante(baseMessage.dni_solicitante())
            .declaracion_jurada(baseMessage.declaracion_jurada())
            .dni_receptor(baseMessage.dni_receptor())
            .recipientEmail(effectiveEmail)
            .to(baseMessage.to())
            .user_to_nombre(baseMessage.user_to_nombre())
            .user_to_apellido(baseMessage.user_to_apellido())
            .user_to_numero_documento(baseMessage.user_to_numero_documento())
            .user_to_tipo_documento(baseMessage.user_to_tipo_documento())
            .user_to_genero(baseMessage.user_to_genero())
            .user_to_celular(baseMessage.user_to_celular())
            .user_from_nombre(baseMessage.user_from_nombre())
            .user_from_last_name(baseMessage.user_from_last_name())
            .username_from(baseMessage.username_from())
            .username_child(baseMessage.username_child())
            .sponsor_username(baseMessage.sponsor_username())
            .sponsor_nombre(baseMessage.sponsor_nombre())
            .sponsor_last_name(baseMessage.sponsor_last_name())
            .username_to(baseMessage.username_to())
            .childId(baseMessage.childId())
            .request_date(baseMessage.request_date())
            .approval_date(baseMessage.approval_date())
            .completion_date(baseMessage.completion_date())
            .user_to_correo_electronico(effectiveEmail)
            .rejectionReason(baseMessage.rejectionReason())
            .rejected_at(baseMessage.rejected_at())
            .rejectionTypeId(baseMessage.rejectionTypeId())
            .rejectionTypeName(baseMessage.rejectionTypeName())
            .nameMembership(baseMessage.nameMembership())
            .build();

        try { log.info("[FINAL-MESSAGE] username_child='{}' username_to='{}' perfilTraspasarModel='{}'", finalMessage.username_child(), finalMessage.username_to(), "<model-built-after>"); } catch (Throwable ignored) {}

        String templateHtml = transferEmailBuilderAdapter.buildHtml(finalMessage);
        log.info("Names to render -> from='{}' to='{}'", 
            finalMessage.sponsor_nombre(),
            finalMessage.user_to_nombre());

        if (templateHtml == null) {
            log.error("Template rendering returned null for message: {} and template for status {}. Aborting send.", finalMessage, finalMessage.id_transfer_status());
        }
        String subject = transferEmailBuilderAdapter.getSubject();
        log.info("Sending transfer email to={} subject={} templateLength={}", finalMessage.user_to_correo_electronico(), subject, templateHtml == null ? 0 : templateHtml.length());

        transferNotificationService
            .sendTransferNotification(finalMessage, subject, templateHtml)
            .doOnNext(sent -> {
                if (sent) log.info("Transfer email sent to {}", finalMessage.user_to_correo_electronico());
                else log.error("Transfer email NOT sent to {}", finalMessage.user_to_correo_electronico());
            })
            .subscribe();
    }


    @KafkaListener(topics = { Topic.REQUEST_SEND_NOTIFICATION }, groupId = "transfer-action-listener")
    public void consumeAction(org.springframework.messaging.Message<world.inclub.appnotification.transfer.infrastructure.kafka.payload.TransferActionMessage> msg) {
        try {
            world.inclub.appnotification.transfer.infrastructure.kafka.payload.TransferActionMessage action = msg.getPayload();
            if (action == null) return;
            log.info("[ACTION-MESSAGE] id={} action={} email={}", action.getId_transfer_request(), action.getAction(), action.getRecipientEmail());

    Integer status;
    if ("ACCEPTED".equalsIgnoreCase(action.getAction())) status = 2;
    else if ("REJECTED".equalsIgnoreCase(action.getAction())) status = 3;
        else return;

    String targetEmail = action.getUser_from_email() != null && !action.getUser_from_email().isBlank() ? action.getUser_from_email() : action.getRecipientEmail();
    world.inclub.appnotification.transfer.application.dto.TransferNotificationMessage dto = world.inclub.appnotification.transfer.application.dto.TransferNotificationMessage.builder()
            .id_transfer_request(action.getId_transfer_request())
            .id_transfer_status(status)
            .user_to_correo_electronico(targetEmail)
            .recipientEmail(targetEmail)
            .user_to_nombre(action.getUser_to_nombre())
            .user_to_apellido(action.getUser_to_apellido())
            .user_from_nombre(action.getUser_from_nombre())
            .user_from_last_name(action.getUser_from_apellido())
            .build();

            String html = transferEmailBuilderAdapter.buildHtml(dto);
            String subject = transferEmailBuilderAdapter.getSubject();
            transferNotificationService.sendTransferNotification(dto, subject, html).subscribe(sent -> {
                if (sent) log.info("Action email sent for id={}", action.getId_transfer_request());
                else log.error("Action email NOT sent for id={}", action.getId_transfer_request());
            });
        } catch (Exception e) {
            log.error("Error processing action message: {}", e.getMessage(), e);
        }
    }

}
