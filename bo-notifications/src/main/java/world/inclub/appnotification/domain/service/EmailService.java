package world.inclub.appnotification.domain.service;

import freemarker.template.TemplateException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import world.inclub.appnotification.application.usecases.IEmailService;
import world.inclub.appnotification.application.usecases.INotificationService;
import world.inclub.appnotification.domain.constant.NotificationConstant;
import world.inclub.appnotification.domain.dto.SubscriptionDelayDTO;
import world.inclub.appnotification.domain.dto.request.EmailRequestDTO;
import world.inclub.appnotification.domain.dto.request.InfoEmail;
import world.inclub.appnotification.domain.dto.request.UserResponse;
import world.inclub.appnotification.domain.port.IEmailBuilder;
import world.inclub.appnotification.domain.port.IEmailPort;
import world.inclub.appnotification.domain.port.INotificationSubscriptionDelayPort;
import world.inclub.appnotification.infraestructure.entity.NotificationSubscriptionDelay;

import javax.mail.MessagingException;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmailService implements IEmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$"
    );

    private final IEmailPort iEmailPort;
    private final IEmailBuilder iEmailBuilder;
    private final INotificationService iNotificationService;
    private final INotificationSubscriptionDelayPort iNotificationSubscriptionDelayPort;

    @Override
    public void SendEmail(EmailRequestDTO requestDTO) throws MessagingException, IOException, TemplateException {
        logger.info("SendEmail requestDTO: {}", requestDTO);
        String htmlTextTemplate;
        String asuntoUsuario = (requestDTO.getSubject() != null)
                ? requestDTO.getSubject()
                : "Notificación Inclub";
        InfoEmail infoEmail = requestDTO.getInfoEmail();
        String otherEmail = (infoEmail != null && infoEmail.getOtherEmail() != null) ? infoEmail.getOtherEmail().trim() : "";

        String emailUsuario = "notificaciones.inclub@gmail.com";
        String emailSponsor = "notificaciones.inclub@gmail.com";
        if (requestDTO.getUser() != null && requestDTO.getUser().getEmail() != null) {
            emailUsuario = requestDTO.getUser().getEmail();
        }
        if (requestDTO.getUserSponsor() != null && requestDTO.getUserSponsor().getEmail() != null) {
            emailSponsor = requestDTO.getUserSponsor().getEmail();
        }

        List<String> listEmailsSend = new ArrayList<>();
        if (infoEmail != null && infoEmail.isISSENDEMAILSPONSOR()) {
            if (Arrays.asList(1, 3, 21).contains(infoEmail.getTypeTemplate())) {
                listEmailsSend.add(emailSponsor);
            }
        }

        if (!otherEmail.isEmpty()) {
            List<String> otherEmails = Arrays.stream(otherEmail.split(","))
                    .map(String::trim)
                    .filter(email -> !email.isEmpty() && isValidEmail(email))
                    .collect(Collectors.toList());
            List<String> invalidEmails = Arrays.stream(otherEmail.split(","))
                    .map(String::trim)
                    .filter(email -> !email.isEmpty() && !isValidEmail(email))
                    .collect(Collectors.toList());
            if (!invalidEmails.isEmpty()) {
                logger.warn("Correos inválidos en otherEmail: {}", invalidEmails);
            }
            listEmailsSend.addAll(otherEmails);
        }
        listEmailsSend.add("notificaciones.inclub@gmail.com");

        switch (requestDTO.getInfoEmail().getTypeTemplate()) {
            case 1:
                htmlTextTemplate = iEmailBuilder.buildHtmlUserCredentials(requestDTO);
                asuntoUsuario = NotificationConstant.AsuntoCorreoUsuario;
                this.iEmailPort.sendEmail(emailUsuario, asuntoUsuario, htmlTextTemplate, listEmailsSend);
                break;
            case 2:
            case 3:
                htmlTextTemplate = iEmailBuilder.buildHtmlAlertSponsor(requestDTO);
                this.iEmailPort.sendEmail(emailSponsor, asuntoUsuario, htmlTextTemplate, listEmailsSend);
                break;
            case 4:
                htmlTextTemplate = iEmailBuilder.buildHtmlPayLater(requestDTO);
                this.iEmailPort.sendEmail(emailUsuario, asuntoUsuario, htmlTextTemplate, listEmailsSend);
                break;
            case 5:
                htmlTextTemplate = iEmailBuilder.buildHtmlEmailAcceptedPayment(requestDTO);
                asuntoUsuario = NotificationConstant.AsuntoPagoAceptado;
                this.iEmailPort.sendEmail(emailUsuario, asuntoUsuario, htmlTextTemplate, listEmailsSend);
                break;
            case 6:
                htmlTextTemplate = iEmailBuilder.buildHtmlEmailAlertChangeMeansPayment(requestDTO);
                asuntoUsuario = NotificationConstant.AsuntocambioTipodePago;
                this.iEmailPort.sendEmail(emailUsuario, asuntoUsuario, htmlTextTemplate, listEmailsSend);
                break;
            case 7:
                htmlTextTemplate = iEmailBuilder.buildHtmlEmailSuccesfulPaymentDirectPayment(requestDTO);
                this.iEmailPort.sendEmail(emailUsuario, asuntoUsuario, htmlTextTemplate, listEmailsSend);
                break;
            case 8:
                htmlTextTemplate = iEmailBuilder.buildHtmlEmailRejectedVoucher(requestDTO);
                asuntoUsuario = "Pago Rechazado";
                this.iEmailPort.sendEmail(emailUsuario, asuntoUsuario, htmlTextTemplate, listEmailsSend);
                break;
            case 9:
                htmlTextTemplate = iEmailBuilder.buildHtmlEmailTokenTransferWallet(requestDTO);
                this.iEmailPort.sendEmail(emailUsuario, asuntoUsuario, htmlTextTemplate, listEmailsSend);
                break;
            case 10:
                htmlTextTemplate = iEmailBuilder.buildHtmlEmailEmailTransferForPaymentAfterMembership(requestDTO);
                this.iEmailPort.sendEmail(emailUsuario, asuntoUsuario, htmlTextTemplate, listEmailsSend);
                break;
            case 11:
                htmlTextTemplate = iEmailBuilder.buildHtmlEmailTransferForRentExemption(requestDTO);
                this.iEmailPort.sendEmail(emailUsuario, asuntoUsuario, htmlTextTemplate, listEmailsSend);
                break;
            case 12:
                htmlTextTemplate = iEmailBuilder.buildHtmlEmailTransferForRentExemptionRejection(requestDTO);
                this.iEmailPort.sendEmail(emailUsuario, asuntoUsuario, htmlTextTemplate, listEmailsSend);
                break;
            case 20:
                htmlTextTemplate = iEmailBuilder.buildHtmlEmailDocuments(requestDTO);
                this.iEmailPort.sendEmail(emailUsuario, asuntoUsuario, htmlTextTemplate, listEmailsSend);
                break;
            case 21:
                htmlTextTemplate = iEmailBuilder.buildHtmlAlertPay(requestDTO);
                asuntoUsuario = "Cuota Faltante";
                this.iEmailPort.sendEmail(emailUsuario, asuntoUsuario, htmlTextTemplate, listEmailsSend);
                break;
            case 22:
                htmlTextTemplate = iEmailBuilder.buildHtmlEmailAnnualLiquidation(requestDTO);
                this.iEmailPort.sendEmail(emailUsuario, asuntoUsuario, htmlTextTemplate, listEmailsSend);
                break;
            case 23:
                htmlTextTemplate = iEmailBuilder.buildHtmlEmailAffiliatePaymentAutomatic(requestDTO);
                asuntoUsuario = "Gracias por tu afiliación";
                this.iEmailPort.sendEmail(emailUsuario, asuntoUsuario, htmlTextTemplate, listEmailsSend);
                break;
            case 24:
                htmlTextTemplate = iEmailBuilder.buildHtmlEmailTransactionPaypal(requestDTO);
                asuntoUsuario = "Confirmación de Transferencia PayPal a Wallet";
                this.iEmailPort.sendEmail(emailUsuario, asuntoUsuario, htmlTextTemplate, listEmailsSend);
                break;
            case 25:
                htmlTextTemplate = iEmailBuilder.buildHtmlEmailNotificationRequestLegal(requestDTO);
                asuntoUsuario = "Notificación de Pago Legal";
                this.iEmailPort.sendEmail(emailUsuario, asuntoUsuario, htmlTextTemplate, listEmailsSend);
                break;
            case 26:
                htmlTextTemplate = iEmailBuilder.buildHtmlEmailPaymentApprovedLegal(requestDTO);
                asuntoUsuario =  "Pago Aprobado Legal";
                this.iEmailPort.sendEmail(emailUsuario, asuntoUsuario, htmlTextTemplate, listEmailsSend);
                break;
            case 27:
                htmlTextTemplate = iEmailBuilder.buildHtmlEmailChangeStatusLegal(requestDTO);
                asuntoUsuario = "Estado de Solicitud Legal";
                this.iEmailPort.sendEmail(emailUsuario, asuntoUsuario, htmlTextTemplate, listEmailsSend);
                break;
            case 28:
                htmlTextTemplate = iEmailBuilder.buildHtmlEmailPaymentRejectLegal(requestDTO);
                asuntoUsuario = "Tu pago ha sido rechazado, actualiza ahora";
                this.iEmailPort.sendEmail(emailUsuario, asuntoUsuario, htmlTextTemplate, listEmailsSend);
                break;
            case 29:
                htmlTextTemplate = iEmailBuilder.buildHtmlEmailNotificationRequestLegalProvincia(requestDTO);
                asuntoUsuario = "Notificación de Pago Legal";
                this.iEmailPort.sendEmail(emailUsuario, asuntoUsuario, htmlTextTemplate, listEmailsSend);
                break;
            case 30:
                htmlTextTemplate = iEmailBuilder.buildHtmlEmailPaymentApprovedLegalProvincia(requestDTO);
                asuntoUsuario = "Pago Aprobado Legal";
                this.iEmailPort.sendEmail(emailUsuario, asuntoUsuario, htmlTextTemplate, listEmailsSend);
                break;
            case 31:
                htmlTextTemplate = iEmailBuilder.buildHtmlEmailTransferForShippingDocumentation(requestDTO);
                asuntoUsuario = NotificationConstant.AsuntoEnvioDocumentacion;
                this.iEmailPort.sendEmail(emailUsuario, asuntoUsuario, htmlTextTemplate, listEmailsSend);
                break;
            case 32:
                htmlTextTemplate = iEmailBuilder.buildHtmlEmailCommissionTypeBonusOpenPeriod(requestDTO);
                this.iEmailPort.sendEmail(emailUsuario, asuntoUsuario, htmlTextTemplate, listEmailsSend);
                break;
            case 33:
                htmlTextTemplate = iEmailBuilder.buildHtmlQuotePayedVoucher(requestDTO);
                asuntoUsuario = "Archivo Faltante";
                this.iEmailPort.sendEmail(emailUsuario, asuntoUsuario, htmlTextTemplate, listEmailsSend);
                break;
            case 34:
                htmlTextTemplate = iEmailBuilder.buildHtmlEmailCommissionTypeBonusClosePeriod(requestDTO);
                this.iEmailPort.sendEmail(emailUsuario, asuntoUsuario, htmlTextTemplate, listEmailsSend);
                break;
            case 35:
                htmlTextTemplate = iEmailBuilder.buildHtmlEmailCommissionBonoLogroRangoOpenPeriod(requestDTO);
                this.iEmailPort.sendEmail(emailUsuario, asuntoUsuario, htmlTextTemplate, listEmailsSend);
                break;
            case 36:
                htmlTextTemplate = iEmailBuilder.buildHtmlEmailCommissionBonoLogroRangoClosePeriod(requestDTO);
                this.iEmailPort.sendEmail(emailUsuario, asuntoUsuario, htmlTextTemplate, listEmailsSend);
                break;
            case 37:
                htmlTextTemplate = iEmailBuilder.buildHtmlEmailChangeStatusPickupRiberaLegal(requestDTO);
                asuntoUsuario = "Estado de Solicitud Legal";
                this.iEmailPort.sendEmail(emailUsuario, asuntoUsuario, htmlTextTemplate, listEmailsSend);
                break;
            case 38:
                htmlTextTemplate = iEmailBuilder.buildHtmlEmailChangeStatusPickupSurquilloLegal(requestDTO);
                asuntoUsuario = "Estado de Solicitud Legal";
                this.iEmailPort.sendEmail(emailUsuario, asuntoUsuario, htmlTextTemplate, listEmailsSend);
                break;
            case 39:
                htmlTextTemplate = iEmailBuilder.buildHtmlEmailChangeStatusNotariaLegal(requestDTO);
                asuntoUsuario = "Estado de Solicitud Legal";
                this.iEmailPort.sendEmail(emailUsuario, asuntoUsuario, htmlTextTemplate, listEmailsSend);
                break;
            case 40:
                 htmlTextTemplate = iEmailBuilder.buildHtmlEmailSolicitudRetiroBbancario(requestDTO);
                asuntoUsuario = "Solicitud de Retiro a cuenta bancaria";
                this.iEmailPort.sendEmail(emailUsuario, asuntoUsuario, htmlTextTemplate, listEmailsSend);
                break;

            case 41:
                htmlTextTemplate = iEmailBuilder.buildHtmlEmailRechazoRetiroBancario(requestDTO);
                asuntoUsuario = "Solicitud rechazado de Retiro a cuenta bancaria";
                this.iEmailPort.sendEmail(emailUsuario, asuntoUsuario, htmlTextTemplate, listEmailsSend);
                break;

            case 42:
                htmlTextTemplate = iEmailBuilder.buildHtmlEmailAprobadoRetiroBancario(requestDTO);
                asuntoUsuario = "Solicitud aprobado de Retiro a cuenta bancaria";
                this.iEmailPort.sendEmail(emailUsuario, asuntoUsuario, htmlTextTemplate, listEmailsSend);
                break;

            case 43:
                htmlTextTemplate = iEmailBuilder.buildHtmlEmailOfDueFee(requestDTO);
                asuntoUsuario = "!Tu cuota está próximo a vencer¡";
                this.iEmailPort.sendEmail(emailUsuario, asuntoUsuario, htmlTextTemplate, listEmailsSend);
                break;

            case 44:
                htmlTextTemplate = iEmailBuilder.buildHtmlEmailOfComplianceWithPaymentOfFee(requestDTO);
                asuntoUsuario = "Pago confirmado de tu membresía";
                this.iEmailPort.sendEmail(emailUsuario, asuntoUsuario, htmlTextTemplate, listEmailsSend);
                break;
            case 45:
                htmlTextTemplate = iEmailBuilder.buildHtmlEmailNotificationRequestLegalExtranjero(requestDTO);
                asuntoUsuario = "Notificación de Pago Legal";
                this.iEmailPort.sendEmail(emailUsuario, asuntoUsuario, htmlTextTemplate, listEmailsSend);
                break;
            case 46:
                htmlTextTemplate = iEmailBuilder.buildHtmlEmailPaymentApprovedLegalExtranjero(requestDTO);
                asuntoUsuario = "Pago Aprobado Legal";
                this.iEmailPort.sendEmail(emailUsuario, asuntoUsuario, htmlTextTemplate, listEmailsSend);
                break;
            case 47:
                htmlTextTemplate = iEmailBuilder.buildHtmlEmailTokenGestionBancario(requestDTO);
                this.iEmailPort.sendEmail(emailUsuario, asuntoUsuario, htmlTextTemplate, listEmailsSend);
                break;

            case 48:
                htmlTextTemplate = iEmailBuilder.buildHtmlEmailafiliateCancel(requestDTO);
                asuntoUsuario = "Desafiliación del pago automático";
                this.iEmailPort.sendEmail(emailUsuario, asuntoUsuario, htmlTextTemplate, listEmailsSend);
                break;

            case 49:
                htmlTextTemplate = iEmailBuilder.buildHtmlEmailafiliateCancel(requestDTO);
                asuntoUsuario = "Desafiliación del pago automático";
                this.iEmailPort.sendEmail(emailUsuario, asuntoUsuario, htmlTextTemplate, listEmailsSend);
                break;
            case 50:
                htmlTextTemplate = iEmailBuilder.buildHtmlEmailBeneficiario(requestDTO);
                this.iEmailPort.sendEmail(emailSponsor, requestDTO.getInfoEmail().getSubject(), htmlTextTemplate,
                        listEmailsSend);
                break;

            default:
                throw new IllegalArgumentException("Tipo de plantilla de correo no válido: " + requestDTO.getInfoEmail().getTypeTemplate());
        }
    }

    @Override
    public void sendMails(EmailRequestDTO requestDTO) throws MessagingException, IOException, TemplateException {
        logger.info("sendMails requestDTO: {}", requestDTO);
        String asuntoUsuario = NotificationConstant.AsuntoCorreo;
        InfoEmail infoEmail = requestDTO.getInfoEmail();
        String otherEmail = (infoEmail != null && infoEmail.getOtherEmail() != null) ? infoEmail.getOtherEmail().trim() : "";

        String emailUsuario = "notificaciones.inclub@gmail.com";
        String emailSponsor = "notificaciones.inclub@gmail.com";
        if (requestDTO.getUser() != null && requestDTO.getUser().getEmail() != null) {
            emailUsuario = requestDTO.getUser().getEmail();
        }
        if (requestDTO.getUserSponsor() != null && requestDTO.getUserSponsor().getEmail() != null) {
            emailSponsor = requestDTO.getUserSponsor().getEmail();
        }

        List<String> listEmailsSend = new ArrayList<>();
        if (!otherEmail.isEmpty()) {
            List<String> otherEmails = Arrays.stream(otherEmail.split(","))
                    .map(String::trim)
                    .filter(email -> !email.isEmpty() && isValidEmail(email))
                    .collect(Collectors.toList());
            List<String> invalidEmails = Arrays.stream(otherEmail.split(","))
                    .map(String::trim)
                    .filter(email -> !email.isEmpty() && !isValidEmail(email))
                    .collect(Collectors.toList());
            if (!invalidEmails.isEmpty()) {
                logger.warn("Correos inválidos en otherEmail: {}", invalidEmails);
            }
            listEmailsSend.addAll(otherEmails);
        }
        listEmailsSend.add("notificaciones.inclub@gmail.com");

        this.iEmailPort.sendEmail(emailUsuario, asuntoUsuario, requestDTO.getBody(), listEmailsSend);
    }

    @Override
    public Mono<Void> sendEmailToAnnualLiquidation(SubscriptionDelayDTO response, LocalDateTime date) throws MessagingException, TemplateException, IOException {
        String subject = "";
        String body = "";

        switch (response.getTotalDays()) {
            case 210:
                subject = NotificationConstant.ASUNTO_ANNUAL_LIQUIDATION_7_MONTHS;
                body = NotificationConstant.MESSAGE_7_MONTHS;
                break;
            case 240:
                subject = NotificationConstant.ASUNTO_ANNUAL_LIQUIDATION_8_MONTHS;
                body = NotificationConstant.MESSAGE_8_MONTHS;
                break;
            case 270:
                subject = NotificationConstant.ASUNTO_ANNUAL_LIQUIDATION_9_MONTHS;
                body = NotificationConstant.MESSAGE_9_MONTHS;
                break;
            case 300:
                subject = NotificationConstant.ASUNTO_ANNUAL_LIQUIDATION_10_MONTHS;
                body = NotificationConstant.MESSAGE_10_MONTHS;
                break;
            case 330:
                subject = NotificationConstant.ASUNTO_ANNUAL_LIQUIDATION_11_MONTHS;
                body = NotificationConstant.MESSAGE_11_MONTHS;
                break;
            case 349:
                subject = NotificationConstant.ASUNTO_ANNUAL_LIQUIDATION_15_DAYS;
                body = NotificationConstant.MESSAGE_15_DAYS;
                break;
            case 357:
                subject = NotificationConstant.ASUNTO_ANNUAL_LIQUIDATION_7_DAYS;
                body = NotificationConstant.MESSAGE_7_DAYS;
                break;
            case 361:
                subject = NotificationConstant.ASUNTO_ANNUAL_LIQUIDATION_3_DAYS;
                body = NotificationConstant.MESSAGE_3_DAYS;
                break;
            case 364:
                subject = NotificationConstant.ASUNTO_ANNUAL_LIQUIDATION_0_DAYS;
                body = NotificationConstant.MESSAGE_0_DAYS;
                break;
            default:
                if (response.getTotalDays() >= 365) {
                    subject = NotificationConstant.ASUNTO_ANNUAL_LIQUIDATION;
                    body = NotificationConstant.MESSAGE_ANNUAL_LIQUIDATION;
                    break;
                }
        }

        if (!subject.isEmpty() && !body.isEmpty()) {
            UserResponse user = UserResponse.builder()
                    .idUser(response.getIdUser())
                    .name(response.getName())
                    .lastName(response.getLastName())
                    .userName(response.getUserName())
                    .nroTelf(response.getPhoneNumber())
                    .email(response.getEmail())
                    .build();

            InfoEmail infoEmail = InfoEmail.builder()
                    .typeTemplate(22)
                    .ISENVIOEMAILMASTER(false)
                    .ISSENDEMAILSPONSOR(false)
                    .build();

            EmailRequestDTO input = EmailRequestDTO.builder()
                    .infoEmail(infoEmail)
                    .user(user)
                    .subject(subject)
                    .body(body)
                    .build();

            String finalSubject = subject;
            return iNotificationSubscriptionDelayPort.existsByIdSubscriptionAndTotalDays(response.getIdSubscription(), response.getTotalDays())
                    .flatMap(exists -> {
                        if (exists) {
                            logger.info("Ya se envió anteriormente el correo de liquidación anual para la suscripción {} con {} días de retraso", response.getIdSubscription(), response.getTotalDays());
                            return Mono.empty();
                        } else {
                            try {
                                SendEmail(input);
                            } catch (MessagingException | TemplateException | IOException e) {
                                return Mono.error(new RuntimeException("Error sending notification: " + e.getMessage()));
                            }
                            return iNotificationService.saveNotificationUser(user.getEmail())
                                    .flatMap(notificationSave -> {
                                        NotificationSubscriptionDelay delay = NotificationSubscriptionDelay.builder()
                                                .idSubscription(response.getIdSubscription())
                                                .idNotification(notificationSave.getId())
                                                .notificationDate(date)
                                                .notificationType(finalSubject)
                                                .totalDays(response.getTotalDays())
                                                .build();
                                        return iNotificationSubscriptionDelayPort.save(delay);
                                    })
                                    .then();
                        }
                    });
        }
        logger.warn("No se pudo enviar el correo, asunto o cuerpo vacíos");
        return Mono.empty();
    }

    private boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }
}