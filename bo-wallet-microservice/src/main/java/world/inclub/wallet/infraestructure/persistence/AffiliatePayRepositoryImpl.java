package world.inclub.wallet.infraestructure.persistence;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.api.dtos.AffiliatePayDTO;
import world.inclub.wallet.api.dtos.DesaffiliateDTO;
import world.inclub.wallet.api.dtos.SuscriptionDTO;
import world.inclub.wallet.domain.entity.AffiliatePay;
import world.inclub.wallet.domain.port.IAffiliatePayPort;
import world.inclub.wallet.infraestructure.exception.common.ResourceNotFoundException;
import world.inclub.wallet.infraestructure.kafka.dtos.response.UserAccountDTO;
import world.inclub.wallet.infraestructure.kafka.service.KafkaRequestReplyAccountService;
import world.inclub.wallet.infraestructure.repository.IAffiliatePayRepository;
import world.inclub.wallet.infraestructure.repository.IWalletRepository;
import world.inclub.wallet.infraestructure.serviceagent.service.MembershipPayment;
import world.inclub.wallet.infraestructure.serviceagent.service.NotificationService;

import java.time.*;
import java.time.temporal.ChronoUnit;

@Slf4j
@Repository
@RequiredArgsConstructor
public class AffiliatePayRepositoryImpl implements IAffiliatePayPort {
    private final IAffiliatePayRepository iAffiliatePayRepository;

    private final IWalletRepository iWalletRepository;
    private final NotificationService notificationService;
    private final KafkaRequestReplyAccountService serviceKafka;
    private final MembershipPayment membershipPayment;

    private final LocalDateTime fechaActual = LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS);

    @Override
    public Mono<AffiliatePay> saveAffiliatePay(AffiliatePayDTO affiliatePayDTO) {

        return iWalletRepository.findByIdUser(affiliatePayDTO.getIduser())
                .switchIfEmpty(Mono.error(new ResourceNotFoundException(
                        "No se encontró un wallet para el usuario con ID: " + affiliatePayDTO.getIduser())))
                .flatMap(wallet -> {
                    return iAffiliatePayRepository.existsByNamePackage(wallet.getIdWallet(), affiliatePayDTO.getIdsuscription(), affiliatePayDTO.getIdPackage(), affiliatePayDTO.getIsActive())
                            .flatMap(exists -> {
                                if (exists) {

                                    return Mono.error(new ResourceNotFoundException(
                                            String.format("Ya existe un affiliatePay con el Nombre: %s para el usuario con ID: %d", affiliatePayDTO.getNamePackage(), affiliatePayDTO.getIduser()
                                            )));
                                }
                                Mono<SuscriptionDTO> suscriptionMono = iAffiliatePayRepository.findBySuscription(affiliatePayDTO.getIdsuscription())
                                        .switchIfEmpty(Mono.error(new ResourceNotFoundException(
                                                "No se encontró los idpackage y idpackagedetail para la suscription con ID: " + affiliatePayDTO.getIdsuscription())));

                                return suscriptionMono.flatMap(suscription -> {

                                    ZoneId zoneId = ZoneId.of("America/Lima");
                                    AffiliatePay affiliatePay = new AffiliatePay();
                                    affiliatePay.setIdWallet(wallet.getIdWallet());
                                    affiliatePay.setIdSuscription(affiliatePayDTO.getIdsuscription());
                                    affiliatePay.setDateAffiliate(LocalDateTime.now(zoneId));
                                    affiliatePay.setStatus(true);
                                    affiliatePay.setIdPackage(affiliatePayDTO.getIdPackage());
                                    affiliatePay.setIdPackageDetail(suscription.getIdpackagedetail());
                                    affiliatePay.setNamePackage(affiliatePayDTO.getNamePackage());
                                    affiliatePay.setNumberQuotas(affiliatePayDTO.getNumberQuotas());
                                    affiliatePay.setAmount(affiliatePayDTO.getAmount());

                                    return iAffiliatePayRepository.save(affiliatePay)
                                            .flatMap(saved ->
                                                    serviceKafka.getUserAccountById(affiliatePayDTO.getIduser())
                                                            .flatMap(user ->
                                                                    notificationService.sendEmailAffiliateAutomaticPayment(affiliatePayDTO, user)
                                                                            .onErrorResume(error -> {
                                                                                log.error("Error al enviar el correo: {}", error.getMessage());
                                                                                return Mono.empty();
                                                                            })
                                                                            .thenReturn(saved)
                                                            )
                                            );
                                });
                            });
                });

    }

    @Override
    public Mono<AffiliatePay> saveDesaffiliatePay(DesaffiliateDTO affliateDto) {
        return iAffiliatePayRepository.findOneByIdAffiliatePay(affliateDto.getIdaffiliatepay())
                .flatMap(existing -> {

                    return Mono.just(
                            Mono.just(existing)
                    ).flatMap(tuple -> {
                        ZoneId zoneId = ZoneId.of("America/Lima");
                        existing.setDateDesAffiliate(fechaActual);
                        existing.setStatus(affliateDto.getIsActive());
                        existing.setIdReason(affliateDto.getIdReason());
                        existing.setDateDesAffiliate(LocalDateTime.now(zoneId));

                        return iAffiliatePayRepository.save(existing)
                                .flatMap(desaf -> {

                                    AffiliatePayDTO affiliatePayDTO = new AffiliatePayDTO();
                                    affiliatePayDTO.setAmount(affliateDto.getAmountPaid());
                                    affiliatePayDTO.setNamePackage(affliateDto.getMembership());
                                    affiliatePayDTO.setDescription(affliateDto.getMotivo());

                                    UserAccountDTO userDTO = new UserAccountDTO();
                                    userDTO.setIdUser((long)1);
                                    userDTO.setName(affliateDto.getName());
                                    userDTO.setLastName(affliateDto.getLastName());
                                    userDTO.setEmail(affliateDto.getEmail());

                                    return notificationService.sendEmailDesaffiliateAutomaticPayment(affiliatePayDTO, userDTO)
                                            .onErrorResume(error -> {
                                                log.error("Error al enviar el correo: {}", error.getMessage());
                                                return Mono.empty();
                                            })
                                            .thenReturn(desaf);

                                });

                    });
                })
                .switchIfEmpty(Mono.error(new RuntimeException("No existe registro : " + affliateDto.getMembership())));
    }

    @Override
    public Flux<AffiliatePay> getAllAffiliatePay(Long IdUser) {
        return iAffiliatePayRepository.getAllAffiliatePay(IdUser);
    }


    @Override
    public Mono<AffiliatePay> finDyId(Long id) {
        return iAffiliatePayRepository.findByStatusIsTrueAndIdReasonIsNotNullAndIdAffiliatePay(id);
    }

}
