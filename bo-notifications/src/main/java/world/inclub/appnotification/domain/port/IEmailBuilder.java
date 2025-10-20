package world.inclub.appnotification.domain.port;

import freemarker.template.TemplateException;
import world.inclub.appnotification.domain.dto.request.EmailRequestDTO;

import java.io.IOException;
import java.util.Map;

public interface IEmailBuilder {

    public String buildHtmlUserCredentials(EmailRequestDTO email) throws IOException, TemplateException;

    public String buildHtmlQuotePayedVoucher(EmailRequestDTO email) throws IOException, TemplateException;

    public String buildHtmlAlertSponsor(EmailRequestDTO email) throws IOException, TemplateException;

    public String buildHtmlAlertSponsorBeneficiary(EmailRequestDTO email) throws IOException, TemplateException;

    public String buildHtmlAlertPay(EmailRequestDTO email) throws IOException, TemplateException;

    public String buildHtmlPayLater(EmailRequestDTO email) throws IOException, TemplateException;

    public String buildHtmlEmailAcceptedPayment(EmailRequestDTO email) throws IOException, TemplateException;

    public String buildHtmlEmailAlertChangeMeansPayment(EmailRequestDTO email) throws IOException, TemplateException;

    public String buildHtmlEmailSuccesfulPaymentDirectPayment(EmailRequestDTO email) throws IOException, TemplateException;

    public String buildHtmlEmailRejectedVoucher(EmailRequestDTO email) throws IOException, TemplateException;

    public String buildHtmlEmailTokenTransferWallet(EmailRequestDTO email) throws IOException, TemplateException;

    public String buildHtmlEmailEmailTransferForPaymentAfterMembership(EmailRequestDTO email) throws IOException, TemplateException;

    public String buildHtmlEmailDocuments(EmailRequestDTO email) throws IOException, TemplateException;

    public String buildHtmlEmailTransferForRentExemption(EmailRequestDTO email) throws IOException, TemplateException;

    public String buildHtmlEmailTransferForShippingDocumentation(EmailRequestDTO email) throws IOException, TemplateException;

    public String buildHtmlEmailTransferForRentExemptionRejection(EmailRequestDTO email) throws IOException, TemplateException;

    public String buildHtmlGeneric(Map<String, Object> data) throws IOException, TemplateException;

    public String buildHtmlEmailAnnualLiquidation(EmailRequestDTO email) throws IOException, TemplateException;

    public String buildHtmlEmailAffiliatePaymentAutomatic(EmailRequestDTO email) throws IOException, TemplateException;

    public String buildHtmlEmailTransactionPaypal(EmailRequestDTO email) throws IOException, TemplateException;

    public String buildHtmlEmailPaymentApprovedLegal(EmailRequestDTO email) throws IOException, TemplateException;

    public String buildHtmlEmailNotificationRequestLegal(EmailRequestDTO email) throws IOException, TemplateException;

    public String buildHtmlEmailChangeStatusLegal(EmailRequestDTO email) throws IOException, TemplateException;

    public String buildHtmlEmailPaymentRejectLegal(EmailRequestDTO email) throws IOException, TemplateException;

    public String buildHtmlEmailNotificationRequestLegalProvincia(EmailRequestDTO email) throws IOException, TemplateException;

    public String buildHtmlEmailPaymentApprovedLegalProvincia(EmailRequestDTO email) throws IOException, TemplateException;

    public String buildHtmlEmailCommissionTypeBonusOpenPeriod(EmailRequestDTO email) throws IOException, TemplateException;
    public String buildHtmlEmailCommissionTypeBonusClosePeriod(EmailRequestDTO email) throws IOException, TemplateException;
    public String buildHtmlEmailCommissionBonoLogroRangoOpenPeriod(EmailRequestDTO email) throws IOException, TemplateException;
    public String buildHtmlEmailCommissionBonoLogroRangoClosePeriod(EmailRequestDTO email) throws IOException, TemplateException;

    public String buildHtmlEmailChangeStatusPickupRiberaLegal(EmailRequestDTO email) throws IOException, TemplateException;
    public String buildHtmlEmailChangeStatusPickupSurquilloLegal(EmailRequestDTO email) throws IOException, TemplateException;
    public String buildHtmlEmailChangeStatusNotariaLegal(EmailRequestDTO email) throws IOException, TemplateException;

    public String buildHtmlEmailSolicitudRetiroBbancario(EmailRequestDTO email) throws IOException, TemplateException;

    public String buildHtmlEmailAprobadoRetiroBancario(EmailRequestDTO email) throws IOException, TemplateException;

    public String buildHtmlEmailRechazoRetiroBancario(EmailRequestDTO email) throws IOException, TemplateException;

    public String buildHtmlEmailOfDueFee(EmailRequestDTO email) throws IOException, TemplateException;

    public String buildHtmlEmailOfComplianceWithPaymentOfFee(EmailRequestDTO email) throws IOException, TemplateException;

    public String buildHtmlEmailNotificationRequestLegalExtranjero(EmailRequestDTO email) throws IOException, TemplateException;

    public String buildHtmlEmailPaymentApprovedLegalExtranjero(EmailRequestDTO email) throws IOException, TemplateException;

    public String buildHtmlEmailTokenGestionBancario(EmailRequestDTO email) throws IOException, TemplateException;

    public String buildHtmlEmailafiliateCancel(EmailRequestDTO email) throws IOException, TemplateException;

    public String buildHtmlEmailCorrectionDocRejectLegal(EmailRequestDTO email) throws IOException, TemplateException;

    public String buildHtmlEmailBeneficiario(EmailRequestDTO email) throws IOException, TemplateException;
}
