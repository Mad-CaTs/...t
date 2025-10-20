package world.inclub.appnotification.infraestructure.adapter;

import freemarker.template.Template;
import freemarker.template.TemplateException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Repository;
import world.inclub.appnotification.domain.dto.request.*;
import world.inclub.appnotification.domain.port.IEmailBuilder;

import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Repository
public class EmailBuilderAdapter implements IEmailBuilder {

    @Value("${template.emailcredential.name}")
    private String emailCredentialUser;

    @Value("${template.quotepayer.name}")
    private String emailQuotePayer;

    @Value("${template.paylater.name}")
    private String emailPayLater;

    @Value("${template.alertsponsor.name}")
    private String emailAlertSponsor;

    @Value("${template.alertsponsorbeneficiary.name}")
    private String emailAlertSponsorBeneficiary;

    @Value("${template.emailalertpay.name}")
    private String emailAlertPay;

    @Value("${template.emailacceptedpayment.name}")
    private String emailAcceptedPayment;

    @Value("${template.emailalertchangepayment.name}")
    private String emailAlertchangePayment;

    @Value("${template.emailsuccesfulpaymentdirectpayment.name}")
    private String emailSuccesfulPaymentDirectPayment;

    @Value("${template.emailrejeactvoucher.name}")
    private String emailrejeactvoucher;

    @Value("${template.emailtokentransferwallet.name}")
    private String emailtokentransferwallet;

    @Value("${template.emailtokengestionbancario.name}")
    private String emailtokengestionbancario;


    @Value("${template.emailtransferforpaymentaftermembership.name}")
    private String emailtransferforpaymentaftermembership;

    @Value("${template.emaildocuments.name}")
    private String emaildocuments;

    @Value("${template.emailrejectrentexemption.name}")
    private String emailRejectRentExemption;

    @Value("${template.emailrentexemption.name}")
    private String emailRentExemption;

    @Value("${template.emailshippingdocumentation.name}")
    private String emailshippingdocumentation;

    @Autowired
    private freemarker.template.Configuration getFreeMarkerConfigurationBean;

    @Override
    public String buildHtmlUserCredentials(EmailRequestDTO user) throws IOException, TemplateException {
        Template template = getFreeMarkerConfigurationBean
                .getTemplate(emailCredentialUser);
        Writer out = new StringWriter();
        template.process(prepareData(user), out);
        return out.toString();
    }

    private Map<String, Object> prepareData(EmailRequestDTO emailRequest) {
        Map<String, Object> data = new HashMap<>();

        InfoEmail infoEmail = emailRequest.getInfoEmail();
        Date fecha = new Date();
        String nombreCompleto = "";
        String sponsorNombreCompleto = "";
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String now = dateFormat.format(fecha);
        UserSponsordResponse userSponsor = emailRequest.getUserSponsor();

        UserResponse user = emailRequest.getUser();
        if (user != null && user.getName() != null && user.getLastName() != null) {
            nombreCompleto = user.getName() + " " + user.getLastName();
        }

        if (userSponsor != null && userSponsor.getName() != null && userSponsor.getLastName() != null) {
            sponsorNombreCompleto = userSponsor.getName() + " " + userSponsor.getLastName();
        }

        String linkLogin = "https://www.inclub.world/backoffice/home";
        String chatbot = "https://api.whatsapp.com/send/?phone=51987743819&text=Hola&type=phone_number&app_absent=0";
        String telegramLink = "https://t.me/+QltvsFsXWfA71P--";
        String whatsappLink = "https://chat.whatsapp.com/Lsn4NBOMetb0L1zDapwkWr";
        String urlPhoto = "";
        data.put("telegramLink", telegramLink);
        data.put("linklogin", linkLogin);
        data.put("chatbot", chatbot);
        data.put("whatsappLink", whatsappLink);

        if (infoEmail != null) {
            data.put("typeTemplate", infoEmail.getTypeTemplate() != 0 ? infoEmail.getTypeTemplate() : "");
            data.put("amountPaid", infoEmail.getAmountPaid() != null ? infoEmail.getAmountPaid() : "");
            data.put("operationNumber", infoEmail.getOperationNumber() != null ? infoEmail.getOperationNumber() : "");
            data.put("paymentTypeOld", infoEmail.getPaymentTypeOld() != null ? infoEmail.getPaymentTypeOld() : "");
            data.put("paymentSubTypeOld", infoEmail.getPaymentSubTypeOld() != null ? infoEmail.getPaymentSubTypeOld() : "");
            data.put("paymentTypeNew", infoEmail.getPaymentTypeNew() != null ? infoEmail.getPaymentTypeNew() : "");
            data.put("paymentSubTypeNew", infoEmail.getPaymentSubTypeNew() != null ? infoEmail.getPaymentSubTypeNew() : "");
            data.put("idPackage", infoEmail.getIdFamilyPackage() != null ? infoEmail.getIdFamilyPackage() : "");
            data.put("pathPicture", infoEmail.getPathPicture() != null ? infoEmail.getPathPicture() : "");
            data.put("ISENVIOEMAILMASTER", infoEmail.isISENVIOEMAILMASTER());
            data.put("ISSENDEMAILSPONSOR", infoEmail.isISSENDEMAILSPONSOR());
            data.put("packageName", infoEmail.getPackageName() != null ? infoEmail.getPackageName() : "");
            data.put("packageDescription", infoEmail.getPackageDescription() != null ? infoEmail.getPackageDescription() : "");
            data.put("token", infoEmail.getToken() != null ? infoEmail.getToken() : "");
            data.put("date", infoEmail.getDate() != null ? infoEmail.getDate() : "");
            data.put("otherEmail", infoEmail.getOtherEmail() != null ? infoEmail.getOtherEmail() : "");
            data.put("idwallettransactionenvio", infoEmail.getIdWalletTransactionEnvio() != null ? infoEmail.getIdWalletTransactionEnvio() : "");
            urlPhoto = generateImageHeaderByFamilyPackage(infoEmail.getIdFamilyPackage());
            data.put("urlPhoto", urlPhoto);
        } else {
            data.put("typeTemplate", "");
            data.put("amountPaid", "");
            data.put("operationNumber", "");
            data.put("paymentTypeOld", "");
            data.put("paymentSubTypeOld", "");
            data.put("paymentTypeNew", "");
            data.put("paymentSubTypeNew", "");
            data.put("idPackage", "");
            data.put("pathPicture", "");
            data.put("ISENVIOEMAILMASTER", false);
            data.put("ISSENDEMAILSPONSOR", false);
            data.put("packageName", "");
            data.put("packageDescription", "");
            data.put("token", "");
            data.put("otherEmail", "");
            data.put("idwallettransactionenvio", "");
        }
        // Usuario
        if (user != null) {
            data.put("idUser", user.getIdUser() != 0 ? user.getIdUser() : "");
            data.put("nombreCompleto", nombreCompleto != null ? nombreCompleto : "");
            data.put("email", user.getEmail() != null ? user.getEmail() : "");
            data.put("userName", user.getUserName() != null ? user.getUserName() : "");
            data.put("nroTelf", user.getNroTelf() != null ? user.getNroTelf() : "");
            data.put("telegramLink", telegramLink != null ? telegramLink : "");
            data.put("fechaActual", now != null ? now : "");
        } else {
            // Si user es null, establece todos los valores del usuario como vacíos
            data.put("idUser", "");
            data.put("nombreCompleto", "");
            data.put("email", "");
            data.put("userName", "");
            data.put("nroTelf", "");
            data.put("telegramLink", "");
            data.put("fechaActual", "");
        }

        //Sponsor
        if (userSponsor != null) {
            data.put("sponsorEmail", userSponsor.getEmail() != null ? userSponsor.getEmail() : "");
            data.put("sponsorUserName", userSponsor.getUserName() != null ? userSponsor.getUserName() : "");
            data.put("sponsorLastName", userSponsor.getLastName() != null ? userSponsor.getLastName() : "");
            data.put("sponsorNroTelf", userSponsor.getNroTelf() != null ? userSponsor.getNroTelf() : "");
            data.put("sponsorName", userSponsor.getName() != null ? userSponsor.getName() : "");
            data.put("sponsorNombreCompleto", sponsorNombreCompleto != null ? sponsorNombreCompleto : "");
        } else {
            // Si userSponsor es null, establece todos los valores del patrocinador como vacíos
            data.put("sponsorEmail", "");
            data.put("sponsorUserName", "");
            data.put("sponsorLastName", "");
            data.put("sponsorNroTelf", "");
            data.put("sponsorName", "");
            data.put("sponsorNombreCompleto", "");
        }
        // Reason
        Reason reasonReject = infoEmail.getReasonReject();
        if (reasonReject != null) {
            data.put("reasonId", reasonReject.getIdReason());
            data.put("reasonRejection", reasonReject.getReasonRejection() != null ? reasonReject.getReasonRejection() : "");
            data.put("reasonDetail", reasonReject.getDetail() != null ? reasonReject.getDetail() : "");
            data.put("reasonType", reasonReject.getTypeReason());
        } else {
            data.put("reasonId", "");
            data.put("reasonRejection", "");
            data.put("reasonDetail", "");
            data.put("reasonType", 0);
        }
        // Document data
        Document doc = infoEmail.getDocument();
        Map<String, String> documentMap = new HashMap<>();
        if (doc != null) {
            documentMap.put("Contrato", doc.getContract());
            documentMap.put("Cronograma de Pagos", doc.getPaymetSchule());
            documentMap.put("Plan de Beneficios", doc.getBenefitPlan());
            documentMap.put("Codigo de Etica", doc.getCodeOfEthics());
            documentMap.put("Beneficios Adicionales", doc.getAdditionalBenefits());
            documentMap.put("Certificado", doc.getCertificate());
            documentMap.put("Contrato de RCI", doc.getRciContract());
            documentMap.put("Pagaré", doc.getPromissoryNote());
        } else {
            documentMap.put("Contrato", "");
            documentMap.put("Cronograma de Pagos", "");
            documentMap.put("Plan de Beneficios", "");
            documentMap.put("Codigo de Etica", "");
            documentMap.put("Beneficios Adicionales", "");
            documentMap.put("Certificado", "");
            documentMap.put("Contrato de RCI", "");
            documentMap.put("Pagaré", "");
        }
        data.put("document", documentMap);

        // Link Payment
        String linkPayment = infoEmail.getLinkPayment();
        data.put("linkPayment", linkPayment != null ? linkPayment : "");

        // List Titles Quote Rejected
        List<String> listTitlesQuoterejected = infoEmail.getListTitlesQuoterejected();
        data.put("listTitlesQuoterejected", listTitlesQuoterejected != null ? listTitlesQuoterejected : new ArrayList<>());

        // Nros Operation
        List<String> nrosOperation = infoEmail.getNrosOperation();
        data.put("nrosOperation", nrosOperation != null ? nrosOperation : new ArrayList<>());

        return data;
    }

    private String generateImageHeaderByFamilyPackage(int idFamilyPackage) {
        String urlPhoto;
        if (idFamilyPackage == 1) {
            // id de familia 1
            urlPhoto = "<div style='width:50%;'><img src='https://s3.us-east-2.amazonaws.com/backoffice.documents/bo-imagenes/ribera.png' align='left' style='width: 98px;'></div>";
            urlPhoto +="<div style='width:50%;'><img src='https://s3.us-east-2.amazonaws.com/backoffice.documents/bo-imagenes/keola.png' align='left' style='width: 98px;'></div>";
            urlPhoto +="<div style='width:50%;'><img src='https://s3.us-east-2.amazonaws.com/backoffice.documents/bo-imagenes/inclub.png' align='right' style='width: 98px;'></div>";
        } else {
            urlPhoto = "<div style='width:50%;'><img src='https://s3.us-east-2.amazonaws.com/backoffice.documents/bo-imagenes/inresorts.jpeg' align='left' style='width: 98px;'></div>";
            urlPhoto +="<div style='width:50%;'><img src='https://s3.us-east-2.amazonaws.com/backoffice.documents/bo-imagenes/ribera.png' align='left' style='width: 98px;'></div>";
            urlPhoto +="<div style='width:50%;'><img src='https://s3.us-east-2.amazonaws.com/backoffice.documents/bo-imagenes/inclub.png' align='left' style='width: 98px;'></div>";
        }
        return urlPhoto;
    }

    @Override
    public String buildHtmlQuotePayedVoucher(EmailRequestDTO user) throws IOException, TemplateException {
        Template template = getFreeMarkerConfigurationBean
                .getTemplate(emailQuotePayer);
        Writer out = new StringWriter();
        template.process(prepareData(user), out);
        return out.toString();
    }

    @Override
    public String buildHtmlAlertSponsor(EmailRequestDTO user) throws IOException, TemplateException {
        Template template = getFreeMarkerConfigurationBean
                .getTemplate(emailAlertSponsor);
        Writer out = new StringWriter();
        template.process(prepareData(user), out);
        return out.toString();
    }

    @Override
    public String buildHtmlAlertSponsorBeneficiary(EmailRequestDTO user) throws IOException, TemplateException {
        Template template = getFreeMarkerConfigurationBean
                .getTemplate(emailAlertSponsorBeneficiary);
        Writer out = new StringWriter();
        template.process(prepareData(user), out);
        return out.toString();
    }

    @Override
    public String buildHtmlAlertPay(EmailRequestDTO user) throws IOException, TemplateException {
        Template template = getFreeMarkerConfigurationBean
                .getTemplate(emailAlertPay);
        Writer out = new StringWriter();
        template.process(prepareData(user), out);
        return out.toString();
    }

    @Override
    public String buildHtmlPayLater(EmailRequestDTO email) throws IOException, TemplateException {
        Template template = getFreeMarkerConfigurationBean
                .getTemplate(emailPayLater);
        Writer out = new StringWriter();
        template.process(prepareData(email), out);
        return out.toString();
    }

    @Override
    public String buildHtmlEmailAcceptedPayment(EmailRequestDTO email) throws IOException, TemplateException {
        Template template = getFreeMarkerConfigurationBean
                .getTemplate(emailAcceptedPayment);
        Writer out = new StringWriter();
        template.process(prepareData(email), out);
        return out.toString();
    }

    @Override
    public String buildHtmlEmailAlertChangeMeansPayment(EmailRequestDTO email) throws IOException, TemplateException {
        Template template = getFreeMarkerConfigurationBean
                .getTemplate(emailAlertchangePayment);
        Writer out = new StringWriter();
        template.process(prepareData(email), out);
        return out.toString();
    }

    @Override
    public String buildHtmlEmailSuccesfulPaymentDirectPayment(EmailRequestDTO email) throws IOException, TemplateException {
        Template template = getFreeMarkerConfigurationBean
                .getTemplate(emailSuccesfulPaymentDirectPayment);
        Writer out = new StringWriter();
        template.process(prepareData(email), out);
        return out.toString();
    }

    @Override
    public String buildHtmlEmailRejectedVoucher(EmailRequestDTO email) throws IOException, TemplateException {
        Template template = getFreeMarkerConfigurationBean
                .getTemplate(emailrejeactvoucher);
        Writer out = new StringWriter();
        template.process(prepareData(email), out);
        return out.toString();
    }

    @Override
    public String buildHtmlEmailTokenTransferWallet(EmailRequestDTO email) throws IOException, TemplateException {
        Template template = getFreeMarkerConfigurationBean
                .getTemplate(emailtokentransferwallet);
        Writer out = new StringWriter();
        template.process(prepareData(email), out);
        return out.toString();
    }

    @Override
    public String buildHtmlEmailEmailTransferForPaymentAfterMembership(EmailRequestDTO email) throws IOException, TemplateException {
        Template template = getFreeMarkerConfigurationBean
                .getTemplate(emailtransferforpaymentaftermembership);
        Writer out = new StringWriter();
        template.process(prepareData(email), out);
        return out.toString();
    }

    @Override
    public String buildHtmlEmailDocuments(EmailRequestDTO email) throws IOException, TemplateException {
        Template template = getFreeMarkerConfigurationBean
                .getTemplate(emaildocuments);
        Writer out = new StringWriter();
        template.process(prepareData(email), out);
        return out.toString();
    }

    @Override
    public String buildHtmlEmailTransferForRentExemption(EmailRequestDTO email) throws IOException, TemplateException {
        Template template = getFreeMarkerConfigurationBean
                .getTemplate(emailRentExemption);
        Writer out = new StringWriter();
        template.process(prepareData(email), out);
        return out.toString();
    }

    @Override
    public String buildHtmlEmailTransferForShippingDocumentation (EmailRequestDTO email) throws IOException, TemplateException {
        Template template = getFreeMarkerConfigurationBean
                .getTemplate(emailshippingdocumentation);
        Writer out = new StringWriter();
        template.process(prepareData(email), out);
        return out.toString();
    }

    @Override
    public String buildHtmlEmailTransferForRentExemptionRejection(EmailRequestDTO email) throws IOException, TemplateException {
        Template template = getFreeMarkerConfigurationBean
                .getTemplate(emailRejectRentExemption);
        Writer out = new StringWriter();
        template.process(prepareData(email), out);
        return out.toString();
    }

    @Override
    public String buildHtmlGeneric(Map<String, Object> data) throws IOException, TemplateException {
        Template template = getFreeMarkerConfigurationBean
                .getTemplate(emailQuotePayer);
        Writer out = new StringWriter();
        template.process(data, out);
        return out.toString();
    }

    @Override
    public String buildHtmlEmailAnnualLiquidation(EmailRequestDTO email) throws IOException {
        ZoneId limaZone = ZoneId.of("America/Lima");
        LocalDateTime now = LocalDateTime.now(limaZone);
        return loadEmailTemplate("templates/email_annual_liquidation.html")
                .replace("{{name}}", email.getUser().getName() + " " + email.getUser().getLastName())
                .replace("{{message}}", email.getBody())
                .replace("{{link}}", "https://inclub.world/backoffice/login-nuevo")
                .replace("{{year}}", String.valueOf(now.getYear()));
    }

    @Override
    public String buildHtmlEmailAffiliatePaymentAutomatic(EmailRequestDTO email) throws IOException, TemplateException {
        ZoneId limaZone = ZoneId.of("America/Lima");
        LocalDateTime now = LocalDateTime.now(limaZone);

        DateTimeFormatter formatterXpired = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        LocalDateTime fechaExpired = LocalDateTime.parse(email.getInfoEmail().getCreatedUp(), formatterXpired);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        DateTimeFormatter formatDay = DateTimeFormatter.ofPattern("dd");
        String MonthName = fechaExpired.getMonth().name().substring(0, 1).toUpperCase() + fechaExpired.getMonth().name().substring(1).toLowerCase();
        String monthDate = MonthName +". "+ fechaExpired.format(formatDay) + ", "+ fechaExpired.getYear();
        String registerDate = now.format(formatter);

        return loadEmailTemplate("templates/email_affiliate_payment_automatic.html")
                .replace("{{name}}", email.getUser().getName() + " " + email.getUser().getLastName())
                .replace("{{amount}}", email.getInfoEmail().getAmountPaid().toString())
                .replace("{{membership}}", email.getInfoEmail().getPackageName())
                .replace("{{xpiredDate}}",registerDate)
                .replace("{{xpiredDateName}}",monthDate)
                .replace("{{year}}", String.valueOf(now.getYear()));
    }

    @Override
    public String buildHtmlEmailTransactionPaypal(EmailRequestDTO email) throws IOException, TemplateException {
        ZoneId limaZone = ZoneId.of("America/Lima");
        LocalDateTime nowInLima = LocalDateTime.now(limaZone);
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("hh:mm a");
        String fullDate = nowInLima.format(dateFormatter);
        String fullTime = nowInLima.format(timeFormatter);

        return loadEmailTemplate("templates/email_transaction_recharge_paypal.html")
                .replace("{{userFullName}}", email.getUser().getName() + " " + email.getUser().getLastName())
                .replace("{{email}}", email.getUser().getEmail().toString())
                .replace("{{codePaypal}}", email.getInfoEmail().getPaypalTransactionCode().toString())
                .replace("{{subTotal}}", email.getInfoEmail().getSubTotal().toString())
                .replace("{{tasaMount}}", email.getInfoEmail().getTasa().toString())
                .replace("{{comissionMount}}", email.getInfoEmail().getComision().toString())
                .replace("{{totalMount}}", email.getInfoEmail().getTotalMount().toString())
                .replace("{{fullDate}}", fullDate)
                .replace("{{fullHours}}", fullTime)
                .replace("{{year}}", String.valueOf(nowInLima.getYear()));
    }

    @Override
    public String buildHtmlEmailPaymentApprovedLegal(EmailRequestDTO email) throws IOException, TemplateException {
        ZoneId limaZone = ZoneId.of("America/Lima");
        LocalDateTime now = LocalDateTime.now(limaZone);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        String fechaFormateada = now.format(formatter);
        return loadEmailTemplate("templates/email_legal_aproved_payment.html")
                .replace("{{name}}", email.getUser().getName() + " " + email.getUser().getLastName())
                .replace("{{family_package_name}}", email.getInfoEmail().getPackageName())
                .replace("{{suscription_name}}", email.getInfoEmail().getSuscriptionName())
                .replace("{{amount}}", email.getInfoEmail().getAmountPaid().toString())
                .replace("{{total_amount}}", email.getInfoEmail().getAmountPaid().toString())
                .replace("{{tipo_documento}}", email.getInfoEmail().getDocumentNameLegal())
                .replace("{{cod_operacion}}", email.getInfoEmail().getOperationNumber())
                .replace("{{user_local_ubi}}", email.getInfoEmail().getPaymentSubTypeOld())
                .replace("{{date_format}}", fechaFormateada)
                .replace("{{link}}", "https://inclub.world/backoffice/login-nuevo")
                .replace("{{year}}", String.valueOf(now.getYear()));
    }

    @Override
    public String buildHtmlEmailNotificationRequestLegal(EmailRequestDTO email) throws IOException, TemplateException {
        ZoneId limaZone = ZoneId.of("America/Lima");
        LocalDateTime now = LocalDateTime.now(limaZone);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        String fechaFormateada = now.format(formatter);
        return loadEmailTemplate("templates/email_legal_notificacion_payment.html")
                .replace("{{name}}", email.getUser().getName() + " " + email.getUser().getLastName())
                .replace("{{family_package_name}}", email.getInfoEmail().getPackageName())
                .replace("{{suscription_name}}", email.getInfoEmail().getSuscriptionName())
                .replace("{{amount}}", email.getInfoEmail().getAmountPaid().toString())
                .replace("{{total_amount}}", email.getInfoEmail().getAmountPaid().toString())
                .replace("{{tipo_documento}}", email.getInfoEmail().getDocumentNameLegal())
                .replace("{{cod_operacion}}", email.getInfoEmail().getOperationNumber())
                .replace("{{user_local_ubi}}", email.getInfoEmail().getPaymentSubTypeOld())
                .replace("{{tipo_legalizacion}}", email.getInfoEmail().getPaymentTypeOld())
                .replace("{{description}}",email.getInfoEmail().getPackageDescription())
                .replace("{{date_format}}", fechaFormateada)
                .replace("{{link}}", "https://inclub.world/backoffice/login-nuevo")
                .replace("{{year}}", String.valueOf(now.getYear()));
    }

    @Override
    public String buildHtmlEmailChangeStatusLegal(EmailRequestDTO email) throws IOException, TemplateException {
        ZoneId limaZone = ZoneId.of("America/Lima");
        LocalDateTime now = LocalDateTime.now(limaZone);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        String fechaFormateada = now.format(formatter);
        return loadEmailTemplate("templates/email_legal_change_status.html")
                .replace("{{name}}", email.getUser().getName() + " " + email.getUser().getLastName())
                .replace("{{family_package_name}}", email.getInfoEmail().getPackageName())
                .replace("{{suscription_name}}", email.getInfoEmail().getSuscriptionName())
                .replace("{{status}}", email.getInfoEmail().getPaymentTypeNew())
                .replace("{{tipo_documento}}", email.getInfoEmail().getDocumentNameLegal())
                .replace("{{tipo_legalizacion}}", email.getInfoEmail().getPaymentTypeOld())
                .replace("{{user_local_ubi}}", email.getInfoEmail().getPaymentSubTypeOld())
                .replace("{{date_format}}", fechaFormateada)
                .replace("{{link}}", "https://inclub.world/backoffice/login-nuevo")
                .replace("{{year}}", String.valueOf(now.getYear()));
    }

    @Override
    public String buildHtmlEmailPaymentRejectLegal(EmailRequestDTO email) throws IOException, TemplateException {
        ZoneId limaZone = ZoneId.of("America/Lima");
        LocalDateTime now = LocalDateTime.now(limaZone);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        String text = "Legalización de ";
        String typeDocument =email.getInfoEmail().getPackageName();
        String typeLegal =email.getInfoEmail().getPaymentTypeOld();
        String fechaFormateada = now.format(formatter);
        return loadEmailTemplate("templates/email_legal_reject_payment.html")
                .replace("{{name}}", email.getUser().getName() + " " + email.getUser().getLastName())
                .replace("{{family_package_name}}", email.getInfoEmail().getPackageName())
                .replace("{{suscription_name}}", email.getInfoEmail().getSuscriptionName())
                .replace("{{amount}}", email.getInfoEmail().getAmountPaid().toString())
                .replace("{{total_amount}}", email.getInfoEmail().getAmountPaid().toString())
                .replace("{{cod_operacion}}",
                        Optional.ofNullable(email.getInfoEmail().getOperationNumber()).orElse("N/A"))
                .replace("{{motivo_rechazo}}",
                        Optional.ofNullable(email.getInfoEmail().getReasonReject().getReasonRejection()).orElse("Sin motivo"))
                .replace("{{mensaje_adicional}}",
                        Optional.ofNullable(email.getInfoEmail().getReasonReject().getDetail()).orElse(""))
                .replace("{{producto_detalle}}",
                        text + typeDocument + " - " + "Tipo " + typeLegal)
                .replace("{{date_format}}", fechaFormateada)
                .replace("{{link}}", "https://inclub.world/backoffice/login-nuevo")
                .replace("{{year}}", String.valueOf(now.getYear()));
    }

    @Override
    public String buildHtmlEmailNotificationRequestLegalProvincia(EmailRequestDTO email) throws IOException, TemplateException {
        ZoneId limaZone = ZoneId.of("America/Lima");
        LocalDateTime now = LocalDateTime.now(limaZone);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        String fechaFormateada = now.format(formatter);
        return loadEmailTemplate("templates/email_legal_notificacion_payment_provincia.html")
                .replace("{{name}}", email.getUser().getName() + " " + email.getUser().getLastName())
                .replace("{{family_package_name}}", email.getInfoEmail().getPackageName())
                .replace("{{suscription_name}}", email.getInfoEmail().getSuscriptionName())
                .replace("{{amount}}", email.getInfoEmail().getAmountPaid().toString())
                .replace("{{costo_envio}}", email.getInfoEmail().getCostoEnvio().toString())
                .replace("{{total_amount}}", email.getInfoEmail().getTotalMount().toString())
                .replace("{{tipo_documento}}", email.getInfoEmail().getDocumentNameLegal())
                .replace("{{cod_operacion}}", email.getInfoEmail().getOperationNumber())
                .replace("{{user_local_ubi}}", email.getInfoEmail().getPaymentSubTypeOld())
                .replace("{{tipo_legalizacion}}", email.getInfoEmail().getPaymentTypeOld())
                .replace("{{description}}",email.getInfoEmail().getPackageDescription())
                .replace("{{date_format}}", fechaFormateada)
                .replace("{{link}}", "https://inclub.world/backoffice/login-nuevo")
                .replace("{{year}}", String.valueOf(now.getYear()));
    }

    @Override
    public String buildHtmlEmailPaymentApprovedLegalProvincia(EmailRequestDTO email) throws IOException, TemplateException {
        ZoneId limaZone = ZoneId.of("America/Lima");
        LocalDateTime now = LocalDateTime.now(limaZone);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        String fechaFormateada = now.format(formatter);
        return loadEmailTemplate("templates/email_legal_aproved_payment_provincia.html")
                .replace("{{name}}", email.getUser().getName() + " " + email.getUser().getLastName())
                .replace("{{family_package_name}}", email.getInfoEmail().getPackageName())
                .replace("{{suscription_name}}", email.getInfoEmail().getSuscriptionName())
                .replace("{{amount}}", email.getInfoEmail().getAmountPaid().toString())
                .replace("{{costo_envio}}", email.getInfoEmail().getCostoEnvio().toString())
                .replace("{{total_amount}}", email.getInfoEmail().getTotalMount().toString())
                .replace("{{tipo_documento}}", email.getInfoEmail().getDocumentNameLegal())
                .replace("{{cod_operacion}}", email.getInfoEmail().getOperationNumber())
                .replace("{{user_local_ubi}}", email.getInfoEmail().getPaymentSubTypeOld())
                .replace("{{tipo_legalizacion}}", email.getInfoEmail().getPaymentTypeOld())
                .replace("{{description}}",email.getInfoEmail().getPackageDescription())
                .replace("{{date_format}}", fechaFormateada)
                .replace("{{link}}", "https://inclub.world/backoffice/login-nuevo")
                .replace("{{year}}", String.valueOf(now.getYear()));
    }

    @Override
    public String buildHtmlEmailCommissionTypeBonusOpenPeriod(EmailRequestDTO email) throws IOException, TemplateException {
        ZoneId limaZone = ZoneId.of("America/Lima");
        LocalDateTime now = LocalDateTime.now(limaZone);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        DateTimeFormatter formatterPeriod = DateTimeFormatter.ofPattern("dd-MM-yy");
        String fechaFormateada = now.format(formatter);
        LocalDate initialLocalDate = email.getInfoEmail().getInitialDatePeriod().toLocalDate();
        String initialLocalDateFormat = initialLocalDate.format(formatterPeriod);
        LocalDate endLocalDate = email.getInfoEmail().getEndDatePeriod().toLocalDate();
        String endLocalDateFormat = endLocalDate.format(formatterPeriod);
        return loadEmailTemplate("templates/email_commission_typebonus_open_period.html")
                .replace("{{name}}",  email.getUser().getName() + " " + email.getUser().getLastName())
                .replace("{{levelSponsor}}", "Nivel" + " " + email.getInfoEmail().getLevelSponsor().toString())
                .replace("{{amount}}", email.getInfoEmail().getAmountPaid().toString())
                .replace("{{percentage}}", email.getInfoEmail().getPercentage().toString() + "%")
                .replace("{{typeBonusName}}", email.getInfoEmail().getTypeBonusName())
                .replace("{{membership}}", email.getInfoEmail().getMembership())
                .replace("{{period}}", "De" + " " + initialLocalDateFormat + " " + "al" + " " + endLocalDateFormat)
                .replace("{{registerDate}}", fechaFormateada)
                .replace("{{year}}", String.valueOf(now.getYear()));
    }

    @Override
    public String buildHtmlEmailCommissionTypeBonusClosePeriod(EmailRequestDTO email) throws IOException, TemplateException {
        ZoneId limaZone = ZoneId.of("America/Lima");
        LocalDateTime now = LocalDateTime.now(limaZone);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        DateTimeFormatter formatterPeriod = DateTimeFormatter.ofPattern("dd-MM-yy");
        String fechaFormateada = now.format(formatter);
        LocalDate initialLocalDate = email.getInfoEmail().getInitialDatePeriod().toLocalDate();
        String initialLocalDateFormat = initialLocalDate.format(formatterPeriod);
        LocalDate endLocalDate = email.getInfoEmail().getEndDatePeriod().toLocalDate();
        String endLocalDateFormat = endLocalDate.format(formatterPeriod);
        return loadEmailTemplate("templates/email_commission_typebonus_close_period.html")
                .replace("{{name}}",  email.getUser().getName() + " " + email.getUser().getLastName())
                .replace("{{levelSponsor}}", "Nivel" + " " + email.getInfoEmail().getLevelSponsor().toString())
                .replace("{{amount}}", email.getInfoEmail().getAmountPaid().toString())
                .replace("{{percentage}}", email.getInfoEmail().getPercentage().toString() + "%")
                .replace("{{typeBonusName}}", email.getInfoEmail().getTypeBonusName())
                .replace("{{membership}}", email.getInfoEmail().getMembership())
                .replace("{{period}}", "De" + " " + initialLocalDateFormat + " " + "al" + " " + endLocalDateFormat)
                .replace("{{registerDate}}", fechaFormateada)
                .replace("{{year}}", String.valueOf(now.getYear()));
    }

    @Override
    public String buildHtmlEmailCommissionBonoLogroRangoOpenPeriod(EmailRequestDTO email) throws IOException, TemplateException {
        ZoneId limaZone = ZoneId.of("America/Lima");
        LocalDateTime now = LocalDateTime.now(limaZone);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        DateTimeFormatter formatterPeriod = DateTimeFormatter.ofPattern("dd-MM-yy");
        String fechaFormateada = now.format(formatter);
        LocalDate initialLocalDate = email.getInfoEmail().getInitialDatePeriod().toLocalDate();
        String initialLocalDateFormat = initialLocalDate.format(formatterPeriod);
        LocalDate endLocalDate = email.getInfoEmail().getEndDatePeriod().toLocalDate();
        String endLocalDateFormat = endLocalDate.format(formatterPeriod);
        return loadEmailTemplate("templates/email_commission_bonologrorango_open_period.html")
                .replace("{{name}}",  email.getUser().getName() + " " + email.getUser().getLastName())
                .replace("{{typeBonusName}}", email.getInfoEmail().getTypeBonusName())
                .replace("{{amount}}", email.getInfoEmail().getAmountPaid().toString())
                .replace("{{period}}", "De" + " " + initialLocalDateFormat + " " + "al" + " " + endLocalDateFormat)
                .replace("{{registerDate}}", fechaFormateada)
                .replace("{{year}}", String.valueOf(now.getYear()));
    }

    @Override
    public String buildHtmlEmailCommissionBonoLogroRangoClosePeriod(EmailRequestDTO email) throws IOException, TemplateException {
        ZoneId limaZone = ZoneId.of("America/Lima");
        LocalDateTime now = LocalDateTime.now(limaZone);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        DateTimeFormatter formatterPeriod = DateTimeFormatter.ofPattern("dd-MM-yy");
        String fechaFormateada = now.format(formatter);
        LocalDate initialLocalDate = email.getInfoEmail().getInitialDatePeriod().toLocalDate();
        String initialLocalDateFormat = initialLocalDate.format(formatterPeriod);
        LocalDate endLocalDate = email.getInfoEmail().getEndDatePeriod().toLocalDate();
        String endLocalDateFormat = endLocalDate.format(formatterPeriod);
        return loadEmailTemplate("templates/email_commission_bonologrorango_open_period.html")
                .replace("{{name}}",  email.getUser().getName() + " " + email.getUser().getLastName())
                .replace("{{typeBonusName}}", email.getInfoEmail().getTypeBonusName())
                .replace("{{amount}}", email.getInfoEmail().getAmountPaid().toString())
                .replace("{{period}}", "De" + " " + initialLocalDateFormat + " " + "al" + " " + endLocalDateFormat)
                .replace("{{registerDate}}", fechaFormateada)
                .replace("{{year}}", String.valueOf(now.getYear()));
    }

    @Override
    public String buildHtmlEmailChangeStatusPickupRiberaLegal(EmailRequestDTO email) throws IOException, TemplateException {
        ZoneId limaZone = ZoneId.of("America/Lima");
        LocalDateTime now = LocalDateTime.now(limaZone);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        String fechaFormateada = now.format(formatter);
        return loadEmailTemplate("templates/email_legal_change_status_pickup_clubribera.html")
                .replace("{{name}}", email.getUser().getName() + " " + email.getUser().getLastName())
                .replace("{{family_package_name}}", email.getInfoEmail().getPackageName())
                .replace("{{suscription_name}}", email.getInfoEmail().getSuscriptionName())
                .replace("{{status}}", email.getInfoEmail().getPaymentTypeNew())
                .replace("{{tipo_documento}}", email.getInfoEmail().getDocumentNameLegal())
                .replace("{{tipo_legalizacion}}", email.getInfoEmail().getPaymentTypeOld())
                .replace("{{user_local_ubi}}", email.getInfoEmail().getPaymentSubTypeOld())
                .replace("{{date_format}}", fechaFormateada)
                .replace("{{link}}", "https://inclub.world/backoffice/login-nuevo")
                .replace("{{year}}", String.valueOf(now.getYear()));
    }

    @Override
    public String buildHtmlEmailChangeStatusPickupSurquilloLegal(EmailRequestDTO email) throws IOException, TemplateException {
        ZoneId limaZone = ZoneId.of("America/Lima");
        LocalDateTime now = LocalDateTime.now(limaZone);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        String fechaFormateada = now.format(formatter);
        return loadEmailTemplate("templates/email_legal_change_status_pickup_ofsurquillo.html")
                .replace("{{name}}", email.getUser().getName() + " " + email.getUser().getLastName())
                .replace("{{family_package_name}}", email.getInfoEmail().getPackageName())
                .replace("{{suscription_name}}", email.getInfoEmail().getSuscriptionName())
                .replace("{{status}}", email.getInfoEmail().getPaymentTypeNew())
                .replace("{{tipo_documento}}", email.getInfoEmail().getDocumentNameLegal())
                .replace("{{tipo_legalizacion}}", email.getInfoEmail().getPaymentTypeOld())
                .replace("{{user_local_ubi}}", email.getInfoEmail().getPaymentSubTypeOld())
                .replace("{{date_format}}", fechaFormateada)
                .replace("{{link}}", "https://inclub.world/backoffice/login-nuevo")
                .replace("{{year}}", String.valueOf(now.getYear()));
    }

    @Override
    public String buildHtmlEmailChangeStatusNotariaLegal(EmailRequestDTO email) throws IOException, TemplateException {
        ZoneId limaZone = ZoneId.of("America/Lima");
        LocalDateTime now = LocalDateTime.now(limaZone);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        String fechaFormateada = now.format(formatter);
        return loadEmailTemplate("templates/email_legal_change_status_notaria.html")
                .replace("{{name}}", email.getUser().getName() + " " + email.getUser().getLastName())
                .replace("{{family_package_name}}", email.getInfoEmail().getPackageName())
                .replace("{{suscription_name}}", email.getInfoEmail().getSuscriptionName())
                .replace("{{status}}", email.getInfoEmail().getPaymentTypeNew())
                .replace("{{tipo_documento}}", email.getInfoEmail().getDocumentNameLegal())
                .replace("{{tipo_legalizacion}}", email.getInfoEmail().getPaymentTypeOld())
                .replace("{{user_local_ubi}}", email.getInfoEmail().getPaymentSubTypeOld())
                .replace("{{date_format}}", fechaFormateada)
                .replace("{{link}}", "https://inclub.world/backoffice/login-nuevo")
                .replace("{{year}}", String.valueOf(now.getYear()));
    }

    private String loadEmailTemplate(String templatePath) {
        try {
            ClassPathResource resource = new ClassPathResource(templatePath);
            String content = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
            return content;
        } catch (IOException e) {
            return null;
        }
    }
    @Override
    public String buildHtmlEmailSolicitudRetiroBbancario(EmailRequestDTO email){
        ZoneId limaZone = ZoneId.of("America/Lima");
        ZonedDateTime transactionDate = email.getInfoEmail().getFechaSolicitud()
                .atZone(limaZone);

        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("hh:mm a")
                .withZone(limaZone);

        String fullDate = transactionDate.format(dateFormatter);
        String fullTime = transactionDate.format(timeFormatter);

        return loadEmailTemplate("templates/email_solicitud_retiro_bancario.html")
                .replace("{{userFullName}}", email.getUser().getName() + " " + email.getUser().getLastName())
                .replace("{{numOperacion}}",email.getInfoEmail().getOperationNumber())
                .replace("{{fechaSolicitud}}" , fullDate +" " +fullTime)
                .replace("{{mount}}", email.getInfoEmail().getAmountPaid().toString())
                .replace("{{userDestino}}", email.getUser().getNameDestination())
                .replace("{{cci}}", email.getInfoEmail().getCuentaInterbancaria())
                .replace("{{nameBank}}", email.getInfoEmail().getNameBank())
                .replace("{{year}}", String.valueOf(transactionDate.getYear()));

    }

    @Override
    public String buildHtmlEmailAprobadoRetiroBancario(EmailRequestDTO email) throws IOException, TemplateException {
        ZoneId limaZone = ZoneId.of("America/Lima");
        ZonedDateTime transactionDate = email.getInfoEmail().getFechaSolicitud()
                .atZone(limaZone);

        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("hh:mm a")
                .withZone(limaZone);

        String fullDate = transactionDate.format(dateFormatter);
        String fullTime = transactionDate.format(timeFormatter);

        return loadEmailTemplate("templates/email_aprobado_retiro_bancario.html")
                .replace("{{userFullName}}", email.getUser().getName() + " " + email.getUser().getLastName())
                .replace("{{numOperacion}}",email.getInfoEmail().getOperationNumber())
                .replace("{{fechaSolicitud}}" , fullDate +" " +fullTime)
                .replace("{{mount}}", email.getInfoEmail().getAmountPaid().toString())
                .replace("{{userDestino}}", email.getUser().getNameDestination())
                .replace("{{cci}}", email.getInfoEmail().getCuentaInterbancaria())
                .replace("{{nameBank}}", email.getInfoEmail().getNameBank())
                .replace("{{year}}", String.valueOf(transactionDate.getYear()));
    }

    @Override
    public String buildHtmlEmailRechazoRetiroBancario(EmailRequestDTO email) throws IOException, TemplateException {
        ZoneId LimaZone = ZoneId.of("America/Lima");
        LocalDateTime transactionDate = email.getInfoEmail().getFechaSolicitud()
                .atZone(ZoneId.systemDefault())
                .withZoneSameInstant(LimaZone)
                .toLocalDateTime();

        return loadEmailTemplate("templates/email_rechazo_retiro_bancario.html")
                .replace("{{userDestino}}", email.getUser().getNameDestination())
                .replace("{{motivo}}", email.getInfoEmail().getMotivo())
                .replace("{{msg}}", email.getInfoEmail().getMsg())
                .replace("{{year}}", String.valueOf(transactionDate.getYear()));
    }

    @Override
    public String buildHtmlEmailOfDueFee(EmailRequestDTO email) throws IOException, TemplateException {
        ZoneId LimaZone = ZoneId.of("America/Lima");
        ZonedDateTime transactionDate = email.getInfoEmail().getFechaSolicitud()
                .atZone(LimaZone);

        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("hh:mm a");
        String fullDate = transactionDate.format(dateFormatter);
        String fullTime = transactionDate.format(timeFormatter);

        return loadEmailTemplate("templates/email_affiliate_payment_OfDueFee.html")
                .replace("{{userName}}", email.getUser().getName() + " " + email.getUser().getLastName())
                .replace("{{mount}}", email.getInfoEmail().getAmountPaid().toString())
                .replace("{{membership}}",email.getInfoEmail().getPackageDescription())
                .replace("{{fullDate}}" , fullDate)
                .replace("{{year}}", String.valueOf(transactionDate.getYear()));
    }

    @Override
    public String buildHtmlEmailOfComplianceWithPaymentOfFee(EmailRequestDTO email) throws IOException, TemplateException {
        ZoneId LimaZone = ZoneId.of("America/Lima");
        ZonedDateTime transactionDate = email.getInfoEmail().getFechaSolicitud().atZone(LimaZone);

        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("hh:mm a");
        String fullDate = transactionDate.format(dateFormatter);
        String fullTime = transactionDate.format(timeFormatter);

        return loadEmailTemplate("templates/email_affiliate_payment_ComplianceOfFee.html")
                .replace("{{userName}}", email.getUser().getName() + " " + email.getUser().getLastName())
                .replace("{{operacionNumber}}",email.getInfoEmail().getOperationNumber())
                .replace("{{datePay}}" , fullDate +" | " +fullTime)
                .replace("{{mount}}", email.getInfoEmail().getAmountPaid().toString())
                .replace("{{comission}}", email.getInfoEmail().getComision().toString())
                .replace("{{totalMount}}", email.getInfoEmail().getTotalMount().toString())
                .replace("{{year}}", String.valueOf(transactionDate.getYear()));
    }

    @Override
    public String buildHtmlEmailNotificationRequestLegalExtranjero(EmailRequestDTO email) throws IOException, TemplateException {
        ZoneId limaZone = ZoneId.of("America/Lima");
        LocalDateTime now = LocalDateTime.now(limaZone);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        String fechaFormateada = now.format(formatter);
        return loadEmailTemplate("templates/email_legal_notificacion_payment_extranjero.html")
                .replace("{{name}}", email.getUser().getName() + " " + email.getUser().getLastName())
                .replace("{{family_package_name}}", email.getInfoEmail().getPackageName())
                .replace("{{suscription_name}}", email.getInfoEmail().getSuscriptionName())
                .replace("{{amount}}", email.getInfoEmail().getAmountPaid().toString())
                .replace("{{costo_envio}}", email.getInfoEmail().getCostoEnvio().toString())
                .replace("{{costo_apostillado}}", email.getInfoEmail().getCostoApostillado().toString())
                .replace("{{total_amount}}", email.getInfoEmail().getTotalMount().toString())
                .replace("{{tipo_documento}}", email.getInfoEmail().getDocumentNameLegal())
                .replace("{{cod_operacion}}", email.getInfoEmail().getOperationNumber())
                .replace("{{user_local_ubi}}", email.getInfoEmail().getPaymentSubTypeOld())
                .replace("{{tipo_legalizacion}}", email.getInfoEmail().getPaymentTypeOld())
                .replace("{{description}}",email.getInfoEmail().getPackageDescription())
                .replace("{{date_format}}", fechaFormateada)
                .replace("{{link}}", "https://inclub.world/backoffice/login-nuevo")
                .replace("{{year}}", String.valueOf(now.getYear()));
    }

    @Override
    public String buildHtmlEmailPaymentApprovedLegalExtranjero(EmailRequestDTO email) throws IOException, TemplateException {
        ZoneId limaZone = ZoneId.of("America/Lima");
        LocalDateTime now = LocalDateTime.now(limaZone);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        String fechaFormateada = now.format(formatter);
        return loadEmailTemplate("templates/email_legal_approved_payment_extranjero.html")
                .replace("{{name}}", email.getUser().getName() + " " + email.getUser().getLastName())
                .replace("{{family_package_name}}", email.getInfoEmail().getPackageName())
                .replace("{{suscription_name}}", email.getInfoEmail().getSuscriptionName())
                .replace("{{amount}}", email.getInfoEmail().getAmountPaid().toString())
                .replace("{{costo_envio}}", email.getInfoEmail().getCostoEnvio().toString())
                .replace("{{costo_apostillado}}", email.getInfoEmail().getCostoApostillado().toString())
                .replace("{{total_amount}}", email.getInfoEmail().getTotalMount().toString())
                .replace("{{tipo_documento}}", email.getInfoEmail().getDocumentNameLegal())
                .replace("{{cod_operacion}}", email.getInfoEmail().getOperationNumber())
                .replace("{{user_local_ubi}}", email.getInfoEmail().getPaymentSubTypeOld())
                .replace("{{tipo_legalizacion}}", email.getInfoEmail().getPaymentTypeOld())
                .replace("{{description}}",email.getInfoEmail().getPackageDescription())
                .replace("{{date_format}}", fechaFormateada)
                .replace("{{link}}", "https://inclub.world/backoffice/login-nuevo")
                .replace("{{year}}", String.valueOf(now.getYear()));
    }
    @Override
    public String buildHtmlEmailTokenGestionBancario(EmailRequestDTO email) throws IOException, TemplateException {
        Template template = getFreeMarkerConfigurationBean
                .getTemplate(emailtokengestionbancario);
        Writer out = new StringWriter();
        template.process(prepareData(email), out);
        return out.toString();
    }

    @Override
    public String buildHtmlEmailafiliateCancel(EmailRequestDTO email) throws IOException, TemplateException {
        ZoneId limaZone = ZoneId.of("America/Lima");
        LocalDateTime now = LocalDateTime.now(limaZone);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        String fechaFormateada = now.format(formatter);

        return loadEmailTemplate("templates/email_affiliate_payment_canceled.html")
                .replace("{{membership}}", email.getInfoEmail().getMembership())
                .replace("{{mount}}", email.getInfoEmail().getAmountPaid().toString())
                .replace("{{motivo}}", email.getInfoEmail().getMotivo())
                .replace("{{fulldate}}", fechaFormateada)
                .replace("{{year}}", String.valueOf(now.getYear()));
    }

    @Override
    public String buildHtmlEmailCorrectionDocRejectLegal(EmailRequestDTO email) throws IOException, TemplateException {
        ZoneId limaZone = ZoneId.of("America/Lima");
        LocalDateTime now = LocalDateTime.now(limaZone);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        String fechaFormateada = now.format(formatter);
        return loadEmailTemplate("templates/email_legal_reject_payment.html")
                .replace("{{name}}", email.getUser().getName() + " " + email.getUser().getLastName())
                .replace("{{motivo_rechazo}}",
                        Optional.ofNullable(email.getInfoEmail().getReasonReject().getReasonRejection()).orElse("Sin motivo"))
                .replace("{{mensaje_adicional}}",
                        Optional.ofNullable(email.getInfoEmail().getReasonReject().getDetail()).orElse(""))
                .replace("{{date_format}}", fechaFormateada)
                .replace("{{link}}", "https://inclub.world/backoffice/login-nuevo")
                .replace("{{year}}", String.valueOf(now.getYear()));
    }

    @Override
    public String buildHtmlEmailBeneficiario(EmailRequestDTO email) throws IOException, TemplateException {
        ZoneId limaZone = ZoneId.of("America/Lima");
        LocalDateTime now = LocalDateTime.now(limaZone);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        String event = email.getInfoEmail().getEvent();
        LocalDateTime fechaMasUnAno = now.plusYears(1);
        String fechaFormateada = fechaMasUnAno.format(formatter);

        String accion = event.equals("create") ? "creación" : event.equals("update") ? "edición" : "eliminado";

        return loadEmailTemplate("templates/email_alert_sponsor_beneficiary.html")
                .replace("{{sponsorNombreCompleto}}",
                        Optional.ofNullable(email.getUserSponsor().getName() + " " + email.getUserSponsor().getLastName())
                                .orElse(""))
                .replace("{{nombreCompleto}}",
                        Optional.ofNullable(email.getInfoEmail().getNameBeneficiary() + " " + email.getInfoEmail().getLastNameBeneficiary())
                                .orElse(""))
                .replace("{{accion}}", accion)
                .replace("{{packageName}}",
                        Optional.ofNullable(email.getInfoEmail().getPackageName())
                                .orElse(""))
                .replace("{{fechaActual}}", fechaFormateada)
                .replace("{{year}}", String.valueOf(now.getYear()));
    }
}