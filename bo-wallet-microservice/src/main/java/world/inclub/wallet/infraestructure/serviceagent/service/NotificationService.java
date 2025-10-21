package world.inclub.wallet.infraestructure.serviceagent.service;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;
import world.inclub.wallet.api.dtos.AffiliatePayDTO;
import world.inclub.wallet.api.dtos.response.SponsorResponse;
import world.inclub.wallet.api.dtos.response.UserResponse;
import world.inclub.wallet.api.mapper.UserMapper;
import world.inclub.wallet.infraestructure.kafka.dtos.response.UserAccountDTO;
import world.inclub.wallet.infraestructure.serviceagent.dtos.EmailRequestDTO;
import world.inclub.wallet.infraestructure.serviceagent.dtos.InfoEmail;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    @Qualifier("notificationWebClient")
    private final WebClient notificationWebClient;

    public Mono<Void> sendEmail(EmailRequestDTO emailRequestDTO) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            String json = objectMapper.writeValueAsString(emailRequestDTO);
            log.info("JSON enviado: " + json);
        } catch (Exception e) {
            System.out.println("Error al convertir el DTO a JSON: " + e.getMessage());
        }

        return notificationWebClient.post()
                .uri("/api/v1/notification/send-email")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(emailRequestDTO)
                .retrieve()
                .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class).flatMap(error -> {
                            System.out.println("Error: " + error);
                            return Mono.error(new Exception(error));
                        }))
                .bodyToMono(Void.class);
    }

    public Mono<Boolean> sendEmailTokenTransferWallet(UserResponse u,
            SponsorResponse s, String tokenWallet) {

        // Para este caso el Sponsor Response actua como el Usuario Receptor de la
        // transferencia
        InfoEmail info = new InfoEmail(tokenWallet);
        // medida para evitar el error de falta de Id para el MS_Notification pendiente
        // de arreglar en el MSde Notigication
        info.setIdFamilyPackage(1);
        EmailRequestDTO request = new EmailRequestDTO(info, u, s);

        return sendEmail(request).then(Mono.just(true));

    }
    public Mono<Boolean> sendEmailTokenGestionBancario(UserResponse u,
                                                      SponsorResponse s, String tokenWallet) {

        // Para este caso el Sponsor Response actua como el Usuario Receptor de la
        // transferencia
        InfoEmail info = new InfoEmail(tokenWallet);
        // medida para evitar el error de falta de Id para el MS_Notification pendiente
        // de arreglar en el MSde Notigication
        info.setTypeTemplate(47);
        info.setIdFamilyPackage(1);
        EmailRequestDTO request = new EmailRequestDTO(info, u, s);
        log.info("request email : {} ", request);
       //return Mono.just(true);
        return sendEmail(request).then(Mono.just(true));

    }
    public Mono<Boolean> sendEmailTransferForPaymentAfterMembership(UserResponse u,
            SponsorResponse s, Integer idWalletTransaction) {

        // Para este caso el Sponsor Response actua como el Usuario Receptor de la
        // transferencia

        InfoEmail info = new InfoEmail(idWalletTransaction);
        // medida para evitar el error de falta de Id para el MS_Notification pendiente
        // de arreglar en el MSde Notigication
        info.setIdFamilyPackage(1);
        EmailRequestDTO request = new EmailRequestDTO(info, u, s);

        return sendEmail(request).then(Mono.just(true));

    };

    public Mono<Boolean> sendEmailAffiliateAutomaticPayment(AffiliatePayDTO user, UserAccountDTO s) {

        // constrccion de evio de correo para afiliacion
        UserResponse userResponse = UserMapper.toUserResponse(s);

        InfoEmail info = new InfoEmail();
        info.setTypeTemplate(23);
        info.setIdsuscription(user.getIdsuscription());
        info.setPackageName(user.getNamePackage());
        info.setNumberQuotas(user.getNumberQuotas());
        info.setAmountPaid(user.getAmount());
        info.setISENVIOEMAILMASTER(false);
        info.setISSENDEMAILSPONSOR(false);
        info.setCreatedUp(user.getDateExpiration());
        EmailRequestDTO request = new EmailRequestDTO( info, userResponse, null);
        return sendEmail(request).then(Mono.just(true));
    }

    public Mono<Boolean> sendEmailDesaffiliateAutomaticPayment(AffiliatePayDTO affiliateDTO, UserAccountDTO us) {

        UserResponse userResponse = UserMapper.toUserResponse(us);

        InfoEmail info = new InfoEmail();
        info.setTypeTemplate(48);
        info.setAmountPaid(affiliateDTO.getAmount());
        info.setMembership(affiliateDTO.getNamePackage());
        info.setMotivo(affiliateDTO.getDescription());
        info.setISENVIOEMAILMASTER(false);
        info.setISSENDEMAILSPONSOR(false);
        EmailRequestDTO request = new EmailRequestDTO( info, userResponse, null);
        return sendEmail(request).then(Mono.just(true));
    }

    public Mono<Boolean> sendNotificationRechargePaypal(InfoEmail emailInfo, UserResponse userInfo){
        EmailRequestDTO request = new EmailRequestDTO(emailInfo, userInfo, null);
        return sendEmail(request).then(Mono.just(true));

    }

}
