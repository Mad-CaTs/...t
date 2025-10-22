package world.inclub.membershippayment.aplication.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
import world.inclub.membershippayment.aplication.dao.SuscriptionDao;
import world.inclub.membershippayment.aplication.service.mapper.MembershipMapper;
import world.inclub.membershippayment.crosscutting.utils.ConstantFields;
import world.inclub.membershippayment.domain.dto.request.SuscriptionRequest;
import world.inclub.membershippayment.domain.dto.response.MultiCodeSubscriptionResponse;
import world.inclub.membershippayment.domain.dto.response.SponsordResponse;
import world.inclub.membershippayment.domain.dto.response.UserResponse;
import world.inclub.membershippayment.domain.entity.Suscription;
import world.inclub.membershippayment.domain.enums.State;
import world.inclub.membershippayment.infraestructure.apisExternas.account.AccountService;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.AdminPanelService;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.PackageDTO;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.service.KafkaAdminPanelService;
import world.inclub.membershippayment.infraestructure.apisExternas.commission.CommissionService;
import world.inclub.membershippayment.infraestructure.apisExternas.notification.NotificationService;
import world.inclub.membershippayment.infraestructure.apisExternas.walllet.WalletService;
import world.inclub.membershippayment.infraestructure.config.kafka.constants.KafkaConstants;
import world.inclub.membershippayment.infraestructure.config.kafka.dtos.request.MembershipMultiCodeDTO;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MultiCodeService {

    private final SuscriptionDao suscriptionDao;
    private final AccountService accountService;
    private final AffiliateService affiliateService;
    private final WalletService walletService;
    private final NotificationService notificationService;
    private final PaymentTransactionalService paymentTransactionalService;
    private final KafkaAdminPanelService kafkaAdminPanelService;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final AdminPanelService adminPanelService;
    private final CommissionService commissionService;


    @Transactional
    public Mono<Boolean> processMultiCodeTransferSubscription(SuscriptionRequest suscriptionRequest) {
        return getExistingSubscription(suscriptionRequest)
                .flatMap(existingSubscription ->
                        Mono.zip(

                                        accountService.getUserSponsor(suscriptionRequest.getIdSponsor()),
                                        paymentTransactionalService.registerUser(suscriptionRequest),
                                        adminPanelService.getPackageData(existingSubscription.getIdPackage(), existingSubscription.getIdPackageDetail())
                                )
                                .flatMap(tuple -> {
                                    SponsordResponse sponsorResponse = tuple.getT1();
                                    UserResponse userResponse = tuple.getT2();
                                    PackageDTO packageDTO = tuple.getT3();
                                    State stateUser = State.ACTIVO;
                                    // Actualizamos la suscripción existente con los datos del usuario a transferir
                                    existingSubscription.setIdUser(userResponse.getIdUser());

                                    Mono.fromRunnable(() -> {
                                        // Actualizamos la suscripción en la base de datos postgres y mongo
                                        transferSubscription(sponsorResponse.getId(), userResponse.getIdUser(), existingSubscription.getIdSuscription().intValue()).subscribe();
                                        suscriptionDao.updateSubscription(existingSubscription).subscribe();
                                        kafkaAdminPanelService.synchronizeSuscriptionData(existingSubscription)
                                                // Commented out commission generation for now
                                                //.then(commissionService.generateCommission(existingSubscription))
                                                .subscribe();

                                        affiliateService.registerAffiliate(userResponse, sponsorResponse,
                                                stateUser, packageDTO, existingSubscription, 0).subscribe();
                                        walletService.createWallet(userResponse.getIdUser()).subscribe();
                                        notificationService.sendEmailCredencialesUser(userResponse, suscriptionRequest, null, sponsorResponse, packageDTO).subscribe();
                                    }).subscribeOn(Schedulers.parallel()).subscribe();
                                    log.info("Transacción exitosa para el usuario: {}", userResponse.getIdUser());

                                    return Mono.just(true);
                                })
                );
    }

    public boolean validateMultiAccountAndSubscription(SuscriptionRequest suscriptionRequest) {
        return ConstantFields.RegisterType.MULTI_ACCOUNT
                .equals(suscriptionRequest.getTypeUser()) && suscriptionRequest.getIdSubscription() != null;
    }

    public Mono<Suscription> getExistingSubscription(SuscriptionRequest suscriptionRequest) {
        // Verifica si la solicitud es de tipo multi-cuenta y si tiene un ID de suscripción
        if (validateMultiAccountAndSubscription(suscriptionRequest)) {
            return getAllSubscriptionsValidForTransfer(suscriptionRequest.getIdSponsor())
                    .collectList()
                    .flatMap(subscriptions -> {
                        return Mono.justOrEmpty(subscriptions.stream()
                                        .filter(sub -> sub.getIdSuscription().equals(suscriptionRequest.getIdSubscription()))
                                        .findFirst()
                                        .orElse(null))
                                .switchIfEmpty(Mono.error(new RuntimeException("Subscription not found for the provided ID")));
                    });
        }
        // Si no es multi-cuenta o no hay ID de suscripción, simplemente retornamos un Mono vacío
        return Mono.empty();
    }

    public Flux<Suscription> getAllSubscriptionsValidForTransfer(Integer parentId) {
        List<Integer> statuses = List.of(State.ACTIVO.getValue(), State.PENDIENTE_VALIDACION_CUOTA_ADELANTADA.getValue());
        return suscriptionDao.getAllByIdUserAndStatus(parentId, statuses)
                .collectList()
                .flatMapMany(subscriptions -> {
                    if (subscriptions.size() < 2) {
                        return Mono.error(new RuntimeException("User must have at least 2 active subscriptions"));
                    }
                    return Flux.fromIterable(subscriptions);
                })
                .onErrorResume(throwable -> {
                    log.error("Error retrieving subscriptions for user {}: {}", parentId, throwable.getMessage());
                    return Flux.empty();
                });
    }

    public Flux<MultiCodeSubscriptionResponse> getAllSubscriptionsValid(Integer parentId) {
        return getAllSubscriptionsValidForTransfer(parentId)
                .flatMap(suscription ->
                        adminPanelService.getPackageData(suscription.getIdPackage(), suscription.getIdPackageDetail())
                                .map(packageData -> MembershipMapper.mapToMultiCodeSubscriptionResponse(suscription, packageData))
                )
                .collectList()
                .flatMapMany(list -> Flux.fromIterable(
                        list.stream()
                                .sorted((r1, r2) ->
                                        r2.creationDate().compareTo(r1.creationDate())
                                )
                                .collect(Collectors.toList())
                ));
    }

    private Mono<Boolean> transferSubscription(Integer parentId, Integer childId, Integer idSubscription) {
        MembershipMultiCodeDTO multiCodeDTO = MembershipMultiCodeDTO.builder()
                .parentId(parentId)
                .childId(childId)
                .idMembership(idSubscription)
                .build();

        return Mono.fromRunnable(() -> kafkaTemplate.send(KafkaConstants.Topic.TOPIC_UPDATE_MEMBERSHIP_MULTI_CODE, multiCodeDTO))
                .thenReturn(true);
    }

}
