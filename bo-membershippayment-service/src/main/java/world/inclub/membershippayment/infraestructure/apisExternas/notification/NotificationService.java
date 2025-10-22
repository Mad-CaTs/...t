package world.inclub.membershippayment.infraestructure.apisExternas.notification;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.aplication.service.TokenPaymentService;
import world.inclub.membershippayment.domain.dto.EmailRequestDTO;
import world.inclub.membershippayment.domain.entity.SubscriptionBeneficiary;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.PackageDTO;
import world.inclub.membershippayment.domain.dto.request.InfoEmail;
import world.inclub.membershippayment.domain.dto.request.SuscriptionRequest;
import world.inclub.membershippayment.domain.dto.response.SponsordResponse;
import world.inclub.membershippayment.domain.dto.response.UserResponse;
import world.inclub.membershippayment.domain.entity.Payment;
import world.inclub.membershippayment.domain.entity.PaymentVoucher;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    @Qualifier("notificationWebClient")
    private final WebClient notificationWebClient;
    private final TokenPaymentService tokenPaymentService;

    public Mono<Boolean> sendEmail(EmailRequestDTO emailRequestDTO) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            String json = objectMapper.writeValueAsString(emailRequestDTO);
            log.info("JSON enviado: " + json);
        } catch (Exception e) {
            log.error("Error al convertir el DTO a JSON: " + e.getMessage());
            return Mono.just(false);
        }

        return notificationWebClient.post()
                .uri("/api/v1/notification/send-email")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(emailRequestDTO)
                .retrieve()
                .bodyToMono(Void.class)
                .thenReturn(true) // Si no hay errores, devuelve true
                .onErrorResume(e -> {
                    log.error("Error enviando el correo: " + e.getMessage());
                    return Mono.just(false); // En caso de error, devuelve false
                });
    }

    public Mono<Boolean> sendEmailCredencialesUser(UserResponse userResponse, SuscriptionRequest suscriptionRequest,
            PaymentVoucher paymentVoucher, SponsordResponse userSponsordResponseDTO, PackageDTO packageDTO) {

        // if (!isPackageBonus) {
        // GenerateCommission
        // GenerateCertificateShar

        // } else {
        // SeriePurchase
        // }
        // ---SendEmailCredencialesUser---

        EmailRequestDTO emailRequestCredencialesUser = new EmailRequestDTO();

        InfoEmail infoEmail = new InfoEmail();

        infoEmail.setTypeTemplate(1);
        infoEmail.setISENVIOEMAILMASTER(true);
        infoEmail.setISSENDEMAILSPONSOR(false);
        if (paymentVoucher != null) {
            infoEmail.setPathPicture(paymentVoucher.getPathPicture());
        }
        infoEmail.setPackageName(packageDTO.getName());
        infoEmail.setIdFamilyPackage(packageDTO.getIdFamilyPackage());
        infoEmail.setPackageDescription(packageDTO.getDescription());

        emailRequestCredencialesUser.setInfoEmail(infoEmail);
        emailRequestCredencialesUser.setUser(userResponse);
        emailRequestCredencialesUser.setUserSponsor(userSponsordResponseDTO);

        return sendEmail(emailRequestCredencialesUser);

        // log.info("emailRequestCredencialesUser: " +
        // emailRequestCredencialesUser.getUserSponsor().getEmail());

        // return Mono.just(true);
    }

    public Mono<Boolean> sendEmailQuotePayedVoucher(UserResponse userResponse, BigDecimal totalAmount,
            SponsordResponse userSponsordResponseDTO, PackageDTO packageDTO, PaymentVoucher paymentVoucher) {
        
       
        // ---SendEmailQuotePayedVoucher---
        EmailRequestDTO emailRequestQuotePayedVoucher = new EmailRequestDTO();

        InfoEmail infoEmail = new InfoEmail();

        if (paymentVoucher == null) {
            infoEmail.setPathPicture("Pendiente de Agregar Voucher");
        } else {
            infoEmail.setPathPicture(paymentVoucher.getPathPicture());
        }

        infoEmail.setTypeTemplate(2);
        infoEmail.setAmountPaid(totalAmount);
        infoEmail.setPackageName(packageDTO.getName());
        infoEmail.setIdFamilyPackage(packageDTO.getIdFamilyPackage());
        
        infoEmail.setPackageDescription(packageDTO.getDescription());

        emailRequestQuotePayedVoucher.setInfoEmail(infoEmail);
        emailRequestQuotePayedVoucher.setUser(userResponse);
        emailRequestQuotePayedVoucher.setUserSponsor(userSponsordResponseDTO);

        return sendEmail(emailRequestQuotePayedVoucher);

    }


    public Mono<Boolean> sendEmailAlertSponsor(UserResponse userResponse, SponsordResponse userSponsordResponseDTO,
            PackageDTO packageDTO) {

        EmailRequestDTO emailRequestAlertSponsor = new EmailRequestDTO();
        InfoEmail infoEmail = new InfoEmail();

        infoEmail.setPackageName(packageDTO.getName());
        infoEmail.setIdFamilyPackage(packageDTO.getIdPackage());
        infoEmail.setTypeTemplate(3);
        infoEmail.setOtherEmail("");
        emailRequestAlertSponsor.setInfoEmail(infoEmail);
        emailRequestAlertSponsor.setUser(userResponse);
        emailRequestAlertSponsor.setUserSponsor(userSponsordResponseDTO);

        return sendEmail(emailRequestAlertSponsor);
    }

    public Mono<Boolean> sendEmailAlertSponsorBeneficiary(UserResponse userResponse,
                                                          SponsordResponse userSponsordResponseDTO,
                                                          PackageDTO packageDTO, SubscriptionBeneficiary beneficiary,
                                                          String event, String subject) {

        EmailRequestDTO emailRequestAlertSponsor = new EmailRequestDTO();
        InfoEmail infoEmail = new InfoEmail();
        infoEmail.setNameBeneficiary(beneficiary.getName()); //  Nombre del beneficiario
        infoEmail.setLastNameBeneficiary(beneficiary.getLastName()); // Apellido del beneficiario
        infoEmail.setDocumentNumberBeneficiary(beneficiary.getNroDocument()); // Número de documento del beneficiario

        infoEmail.setSubject(subject);
        infoEmail.setEvent(event);


        infoEmail.setPackageName(packageDTO.getName());
        infoEmail.setIdFamilyPackage(packageDTO.getIdPackage());
        infoEmail.setTypeTemplate(50);
        infoEmail.setOtherEmail("");
        emailRequestAlertSponsor.setInfoEmail(infoEmail);
        emailRequestAlertSponsor.setUser(userResponse);
        emailRequestAlertSponsor.setUserSponsor(userSponsordResponseDTO);

        return sendEmail(emailRequestAlertSponsor);
    }

    public Mono<Boolean> sendEmailPayLater(UserResponse userResponse, SuscriptionRequest suscriptionRequest,
            PaymentVoucher paymentVoucher, SponsordResponse userSponsordResponseDTO, PackageDTO packageDTO,
            List<Payment> payments) {
        byte DAYSDURATIONPAYLATER = 4;
        int hrsDurationToken = 24 * DAYSDURATIONPAYLATER;
        Integer idSuscription = paymentVoucher.getIdSuscription();
        if (!payments.isEmpty()) {
            Payment firstPayment = payments.get(0);
            return tokenPaymentService
                    .generateTokenPayment(idSuscription, firstPayment.getIdPayment(), hrsDurationToken, payments)

                    .flatMap(tokenPayment -> {
                        // ---SendEmailPayLater---
                        EmailRequestDTO emailRequestPayLater = new EmailRequestDTO();
                        InfoEmail infoEmail = new InfoEmail();

                        infoEmail.setTypeTemplate(4);
                        infoEmail.setToken(tokenPayment.getCodTokenPayment());
                        infoEmail.setPackageName(packageDTO.getName());
                        infoEmail.setIdFamilyPackage(packageDTO.getIdFamilyPackage());
                        infoEmail.setPackageDescription(packageDTO.getDescription());
                        infoEmail.setOtherEmail(suscriptionRequest.getEmail());

                        emailRequestPayLater.setInfoEmail(infoEmail);
                        emailRequestPayLater.setUser(userResponse);
                        emailRequestPayLater.setUserSponsor(userSponsordResponseDTO);

                        try {
                            ObjectMapper objectMapper = new ObjectMapper();
                            String json = objectMapper.writeValueAsString(emailRequestPayLater);
                            log.info("JSON enviado: " + json);
                        } catch (Exception e) {
                            System.out.println("Error al convertir el DTO a JSON: " + e.getMessage());
                        }
                        return sendEmail(emailRequestPayLater);
                    });

        } else {
            return Mono.error(new RuntimeException("No payments found for subscription: " + idSuscription));
        }
    }

    public Mono<Boolean> sendEmailSuccesfulPaymentDirectPayment(UserResponse userResponse, BigDecimal totalAmount, PackageDTO packageDTO){

        EmailRequestDTO emailRequestSuccesfulPaymentDirectPayment = new EmailRequestDTO();
        InfoEmail infoEmail = new InfoEmail();

        infoEmail.setPackageName(packageDTO.getName());
        infoEmail.setAmountPaid(totalAmount);
        infoEmail.setTypeTemplate(7);
        infoEmail.setIdFamilyPackage(packageDTO.getIdFamilyPackage());

        emailRequestSuccesfulPaymentDirectPayment.setUser(userResponse);
        emailRequestSuccesfulPaymentDirectPayment.setInfoEmail(infoEmail);
        log.info("emailRequestDTO: 1{}", emailRequestSuccesfulPaymentDirectPayment);

        return sendEmail(emailRequestSuccesfulPaymentDirectPayment);

    }

}