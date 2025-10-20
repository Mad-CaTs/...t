package world.inclub.appnotification.transfer.infrastructure.email.adapters;

import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import world.inclub.appnotification.transfer.application.dto.TransferNotificationMessage;
import world.inclub.appnotification.transfer.application.enums.TransferStatus;
import world.inclub.appnotification.transfer.infrastructure.email.enums.TransferEmailTemplateEnum;
import world.inclub.appnotification.transfer.infrastructure.email.enums.TransferTypeEnum;
import world.inclub.appnotification.transfer.infrastructure.email.enums.TransferRejectionTypeEnum;
import world.inclub.appnotification.shared.application.port.EmailTemplateBuilderPort;
import world.inclub.appnotification.shared.infrastructure.constants.EmailConstants;

import java.io.IOException;
import java.io.StringWriter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Component
public class TransferEmailBuilderAdapter implements EmailTemplateBuilderPort<TransferNotificationMessage> {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(TransferEmailBuilderAdapter.class);

    private TransferStatus lastStatus;

    @Autowired
    private Configuration freeMarkerConfiguration;

    @Value("${transfer.app-base-url:https://app.inclub.world}")
    private String appBaseUrl;

    private static final DateTimeFormatter DATE_TIME_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy | hh:mm a").withLocale(Locale.forLanguageTag("es-PE"));

    @Override
    public String buildHtml(TransferNotificationMessage dto) {
        // Map flat DTO status id to TransferStatus enum
        this.lastStatus = mapStatus(dto == null ? null : dto.id_transfer_status());
        return renderByStatus(dto);
    }

    public String buildToNewPartnerHtml(TransferNotificationMessage dto) {
        return renderTemplate(dto, TransferEmailTemplateEnum.TRANSFER_TO_NEW_PARTNER.getTemplatePath());
    }

    public String buildDetailsHtml(TransferNotificationMessage dto) {
        return renderTemplate(dto, TransferEmailTemplateEnum.TRANSFER_DETAILS.getTemplatePath());
    }

    public String buildObservationHtml(TransferNotificationMessage dto) {
        return renderTemplate(dto, TransferEmailTemplateEnum.TRANSFER_OBSERVATION.getTemplatePath());
    }

    private String renderByStatus(TransferNotificationMessage dto) {
        TransferStatus status = mapStatus(dto == null ? null : dto.id_transfer_status());
        if (dto == null) return null;
        if (status == null) status = TransferStatus.PENDING;
        return switch (status) {
            case ACCEPTED -> renderTemplate(dto, TransferEmailTemplateEnum.TRANSFER_ACCEPTED.getTemplatePath());
            case PENDING -> renderTemplate(dto, TransferEmailTemplateEnum.TRANSFER_PENDING.getTemplatePath());
            case REJECTED -> renderTemplate(dto, TransferEmailTemplateEnum.TRANSFER_REJECTED.getTemplatePath());
            case OBSERVED -> renderTemplate(dto, TransferEmailTemplateEnum.TRANSFER_OBSERVATION.getTemplatePath());
        };
    }

    private static TransferStatus mapStatus(Integer id) {
        if (id == null) return null;
        return switch (id) {
            case 1 -> TransferStatus.PENDING;
            case 2 -> TransferStatus.ACCEPTED;
            case 3 -> TransferStatus.REJECTED;
            case 4 -> TransferStatus.OBSERVED;
            default -> null;
        };
    }

    private String renderTemplate(TransferNotificationMessage message, String templatePath) {
        try {
            Configuration cfg = this.freeMarkerConfiguration;

            String tpl = templatePath == null ? "" : templatePath.replaceFirst("^/+", "");
            if (tpl.startsWith("templates/")) tpl = tpl.substring("templates/".length());
            Template template = cfg.getTemplate(tpl);

            Map<String, Object> model = buildModel(message);

            StringWriter out = new StringWriter();
            try {
                log.info("[RENDER-DEBUG] template='{}' id_transfer_type='{}' modelKeys={}", tpl, model.get("id_transfer_type"), model.keySet());
            } catch (Throwable ignored) {}
            template.process(model, out);
            return out.toString();
        } catch (IOException | TemplateException e) {
            log.error("Error rendering template {} : {}", templatePath, e.getMessage(), e);
            return null;
        }
    }

    private Map<String, Object> buildModel(TransferNotificationMessage message) {
        Map<String, Object> model = new HashMap<>();
        if (message == null) return model;

        String rFirst = message.user_to_nombre();
        String rLast = message.user_to_apellido();
        String recipientName = ((rFirst == null ? "" : rFirst) + " " + (rLast == null ? "" : rLast)).trim();
        if (recipientName.isBlank()) recipientName = safe(message.recipientEmail());
        String recipientEmail = (message.user_to_correo_electronico() != null && !message.user_to_correo_electronico().isBlank())
                ? message.user_to_correo_electronico()
                : (message.recipientEmail() != null && !message.recipientEmail().isBlank() ? message.recipientEmail() : message.to());
        model.put("clienteNombre", safe(recipientName));
        model.put("clienteEmail", safe(recipientEmail));

    if (message.id_transfer_status() != null && (message.id_transfer_status() == 3 || message.id_transfer_status() == 4)) {
            String fromFirst = message.user_from_nombre();
            String fromLast = message.user_from_last_name();
            String fromFull = ((fromFirst == null ? "" : fromFirst) + " " + (fromLast == null ? "" : fromLast)).trim();
            if (!fromFull.isBlank()) {
                model.put("clienteNombre", safe(fromFull));
                model.put("clienteEmail", safe(message.user_from_email()));
            }

        }


        if (message.id_transfer_status() != null && message.id_transfer_status() == 2) {
            String senderFirst = message.user_from_nombre();
            String senderLast = message.user_from_last_name();
            String acceptedName = null;
            if (! (senderFirst == null || senderFirst.isBlank()) && !(senderLast == null || senderLast.isBlank())) {
                acceptedName = (senderFirst + " " + senderLast).trim();
            } else if (! (senderFirst == null || senderFirst.isBlank())) {
                acceptedName = senderFirst;
            } else {
                String sponsorFirst = message.sponsor_nombre();
                if (! (sponsorFirst == null || sponsorFirst.isBlank())) acceptedName = sponsorFirst;
            }
            if (acceptedName != null && !acceptedName.isBlank()) {
                model.put("clienteNombre", safe(acceptedName));
            }
        }

        if (message.id_transfer_request() != null || message.request_date() != null) {
            String formatted;
            if (message.request_date() != null) {
                formatted = formatDateTime(message.request_date());
            } else {
                formatted = formatDateTime(LocalDateTime.now());
            }
            model.put("fecha", formatted);
            model.put("request_date", formatted);
            model.put("requestDate", formatted);
            Map<String, Object> tx = new HashMap<>();
            tx.put("concept", safe(message.id_transfer_type() != null ? "TRANSFERENCIA" : "TRANSFERENCIA"));
            tx.put("amount", "");
            model.put("transaction", Collections.singletonList(tx));
        } else {
            model.put("fecha", "");
            model.put("transaction", Collections.emptyList());
        }

        String baseApp = normalizeBaseUrl(appBaseUrl);
        String acceptUrl = baseApp + "/transfer/action/accept";
        String rejectUrl = baseApp + "/transfer/action/reject";
        Long idReq = message.id_transfer_request() != null ? message.id_transfer_request() : message.transferRequestId();
        if (idReq != null) {
            acceptUrl = baseApp + "/transfer/" + idReq + "/accept";
            rejectUrl = baseApp + "/transfer/" + idReq + "/reject";
        }
        try {
            String encodedEmail = recipientEmail == null ? "" : java.net.URLEncoder.encode(recipientEmail, java.nio.charset.StandardCharsets.UTF_8.toString());
            String encodedFirst = rFirst == null ? "" : java.net.URLEncoder.encode(rFirst, java.nio.charset.StandardCharsets.UTF_8.toString());
            String encodedLast = rLast == null ? "" : java.net.URLEncoder.encode(rLast, java.nio.charset.StandardCharsets.UTF_8.toString());
            String fromEmail = message.user_from_email() == null ? "" : message.user_from_email();
            String fromFirst = message.user_from_nombre() == null ? "" : message.user_from_nombre();
            String fromLast = message.user_from_last_name() == null ? "" : message.user_from_last_name();
            String encodedFromEmail = fromEmail.isBlank() ? "" : java.net.URLEncoder.encode(fromEmail, java.nio.charset.StandardCharsets.UTF_8.toString());
            String encodedFromFirst = fromFirst.isBlank() ? "" : java.net.URLEncoder.encode(fromFirst, java.nio.charset.StandardCharsets.UTF_8.toString());
            String encodedFromLast = fromLast.isBlank() ? "" : java.net.URLEncoder.encode(fromLast, java.nio.charset.StandardCharsets.UTF_8.toString());
            if (!encodedEmail.isBlank()) {
                String commonParams = "email=" + encodedEmail + "&user_to_nombre=" + encodedFirst + "&user_to_apellido=" + encodedLast;
                acceptUrl = acceptUrl + (acceptUrl.contains("?") ? "&" : "?") + commonParams;
                if (!encodedFromEmail.isBlank()) {
                    String fromParams = "&user_from_email=" + encodedFromEmail + "&user_from_nombre=" + encodedFromFirst + "&user_from_apellido=" + encodedFromLast;
                    acceptUrl += fromParams;
                    rejectUrl += (rejectUrl.contains("?") ? "&" : "?") + "email=" + encodedEmail + fromParams;
                } else {
                    rejectUrl = rejectUrl + (rejectUrl.contains("?") ? "&" : "?") + "email=" + encodedEmail;
                }
            }
        } catch (Exception e) {
        }
        model.put("acceptUrl", acceptUrl);
        model.put("rejectUrl", rejectUrl);

        String userFromFirst = message.user_from_nombre();
        String userFromLast = message.user_from_last_name();
        model.put("user_from_nombre", safe(userFromFirst));
        model.put("user_from_last_name", safe(userFromLast));
        model.put("user_from_name", safe(userFromFirst));
        model.put("user_from_last_name", safe(userFromLast));

        String sponsorFirst = message.sponsor_nombre();
        String sponsorLast = message.sponsor_last_name();
        String sponsorName = ((sponsorFirst == null ? "" : sponsorFirst) + " " + (sponsorLast == null ? "" : sponsorLast)).trim();
        if (!sponsorName.isBlank()) {
            model.put("patrocinadorNombre", sponsorName);
            model.put("patrocinadorDoc", "");
            model.put("patrocinadorUsername", safe(message.sponsor_username()));
            model.put("patrocinadorNombreCompleto", sponsorName);
            model.put("userFromNombreCompleto", sponsorName);
            String[] sponsorParts = sponsorName.split("\\s+", 2);
            model.put("sponsor_nombre", sponsorParts.length > 0 ? sponsorParts[0] : "");
            model.put("sponsor_last_name", sponsorParts.length > 1 ? sponsorParts[1] : "");
            model.put("username_from", safe(message.sponsor_username()));
            model.put("sponsor_username", safe(message.sponsor_username()));
        } else {
            model.put("patrocinadorNombre", "");
            model.put("patrocinadorDoc", "");
            model.put("patrocinadorNombreCompleto", "");
            model.put("userFromNombreCompleto", "");
            model.put("sponsor_nombre", "");
            model.put("sponsor_last_name", "");
            model.put("username_from", "");
            model.put("sponsor_username", "");
        }

        String newMemberName = ((message.user_to_nombre() == null ? "" : message.user_to_nombre()) + " " + (message.user_to_apellido() == null ? "" : message.user_to_apellido())).trim();
        if (newMemberName.isBlank()) newMemberName = safe(recipientName);
        model.put("socioNuevoNombre", newMemberName);
        model.put("socioNuevoDoc", safe(message.user_to_numero_documento()));
        model.put("socioNuevoNombreCompleto", newMemberName);
        model.put("userToNombreCompleto", newMemberName);
        String[] newMemberParts = newMemberName == null ? new String[]{"",""} : newMemberName.trim().split("\\s+", 2);
        model.put("user_to_name", newMemberParts.length > 0 ? newMemberParts[0] : "");
        model.put("user_to_last_name", newMemberParts.length > 1 ? newMemberParts[1] : "");
        model.put("user_to_nombre", model.get("user_to_name"));
        model.put("user_to_apellido", model.get("user_to_last_name"));
        model.put("user_to_numero_documento", model.get("socioNuevoDoc"));

    String perfilVal = null;
    if (message.username_child() != null && !message.username_child().isBlank()) perfilVal = message.username_child();
    else if (message.username_to() != null && !message.username_to().isBlank()) perfilVal = message.username_to();
    else if (message.childId() != null && !message.childId().isBlank()) perfilVal = message.childId();
    else if (message.username_from() != null && !message.username_from().isBlank()) perfilVal = message.username_from();
    if (perfilVal == null) perfilVal = "";
    model.put("username_child_raw", safe(message.username_child()));
    if (message.username_child() != null && !message.username_child().isBlank()) {
        model.put("username_child", safe(message.username_child()));
    } else {
        model.put("username_child", "");
    }

    if (perfilVal != null && !perfilVal.isBlank()) {
        model.put("perfilTraspasar", safe(perfilVal));
        model.put("perfil_a_traspasar", safe(perfilVal));
    } else {
        model.put("perfilTraspasar", "");
        model.put("perfil_a_traspasar", "");
    }
    if (message.nameMembership() != null && !message.nameMembership().isBlank()) {
        model.put("membresiaTraspasar", safe(message.nameMembership()));
        model.put("membresia_traspasar", safe(message.nameMembership()));
    } else {
        model.put("membresiaTraspasar", "");
        model.put("membresia_traspasar", "");
    }

    String transferTypeLabel = TransferTypeEnum.labelOf(message.id_transfer_type());
    model.put("transfer_type_label", safe(transferTypeLabel));
    model.put("id_transfer_type", message.id_transfer_type());
    model.put("idTransferType", message.id_transfer_type());
    model.put("transfer_type", message.id_transfer_type());

        if (message.rejectionReason() != null && !message.rejectionReason().isBlank()) {
            model.put("rejectionReason", message.rejectionReason());
        } else {
            model.put("rejectionReason", "");
        }

        if (message.rejectionReason() != null && !message.rejectionReason().isBlank()) {
            model.put("detailRejectionTransfer", message.rejectionReason());
        } else if (message.rejectionTypeId() != null) {
            String desc = TransferRejectionTypeEnum.descriptionOf(message.rejectionTypeId());
            model.put("detailRejectionTransfer", safe(desc));
        } else {
            model.put("detailRejectionTransfer", "");
        }

        if (message.rejectionTypeId() != null) {
            String typeName = TransferRejectionTypeEnum.nameOf(message.rejectionTypeId());
            String typeDesc = TransferRejectionTypeEnum.descriptionOf(message.rejectionTypeId());
            model.put("rejectionType", safe(typeName));
            model.put("rejectionTypeDescription", safe(typeDesc));
        } else if (message.rejectionTypeName() != null && !message.rejectionTypeName().isBlank()) {
            model.put("rejectionType", message.rejectionTypeName());
            model.put("rejectionTypeDescription", message.rejectionReason() == null ? "" : message.rejectionReason());
        } else {
            model.put("rejectionType", "");
            model.put("rejectionTypeDescription", "");
        }

        model.put("idTransferObservationType", message.rejectionTypeId() == null ? "" : message.rejectionTypeId());
        model.put("id_transfer_observation_type", message.rejectionTypeId() == null ? "" : message.rejectionTypeId());
        model.put("detailObservationTransfer", message.rejectionReason() == null ? "" : message.rejectionReason());

        model.put("transferRequestId", message.id_transfer_request() == null ? "" : message.id_transfer_request());

        model.put("helpEmail", EmailConstants.SUPPORT_EMAIL);
        model.put("year", EmailConstants.getCurrentYear());

        try {
            log.info("[MODEL-DEBUG] perfilTraspasar='{}' username_child='{}' username_child_raw='{}' modelKeys={}",
                model.get("perfilTraspasar"), model.get("username_child"), model.get("username_child_raw"), model.keySet());
        } catch (Throwable ignored) {}

        model.put("iconContacto", "https://s3.us-east-2.amazonaws.com/backoffice.documents/bo-imagenes/49de2cd2-32ac-40f2-9ee0-e98d306671a7-iconContacto.png");
        model.put("iconGmail", "https://s3.us-east-2.amazonaws.com/backoffice.documents/bo-imagenes/f57e3388-1fed-4ac6-9b53-c5bf624b0c8c-iconGmail.png");
        model.put("iconWsp", "https://s3.us-east-2.amazonaws.com/backoffice.documents/bo-imagenes/040ff3d6-d11b-4616-a77e-384a40654601-iconWsp.png");

        return model;
    }

    public Map<String, Object> getModelForMessage(TransferNotificationMessage message) {
        return buildModel(message);
    }

    @Override
    public String getSubject() {
        return switch (lastStatus == null ? TransferStatus.PENDING : lastStatus) {
            case ACCEPTED -> TransferEmailTemplateEnum.TRANSFER_ACCEPTED.getSubject();
            case PENDING -> TransferEmailTemplateEnum.TRANSFER_PENDING.getSubject();
            case REJECTED -> TransferEmailTemplateEnum.TRANSFER_REJECTED.getSubject();
            case OBSERVED -> TransferEmailTemplateEnum.TRANSFER_OBSERVATION.getSubject();
            default -> "Notificación de transferencia";
        };
    }

    public String getObservationSubject() {
        return TransferEmailTemplateEnum.TRANSFER_OBSERVATION.getSubject();
    }

    private static String safe(String s) {
        return s == null ? "" : s;
    }

    private static String formatDateTime(LocalDateTime dt) {
        if (dt == null) return "";
        return dt.format(DATE_TIME_FMT);
    }

    private static String normalizeBaseUrl(String base) {
        String fallBack = "https://app.inclub.world";
        String b = (base == null || base.isBlank()) ? fallBack : base.trim();
        if (b.endsWith("/")) {
            b = b.substring(0, b.length() - 1);
        }
        return b;
    }
}
