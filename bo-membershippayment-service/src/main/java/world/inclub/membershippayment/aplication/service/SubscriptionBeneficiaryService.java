package world.inclub.membershippayment.aplication.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.aplication.dao.SubscriptionBeneficiaryDao;
import world.inclub.membershippayment.domain.dto.response.SponsordResponse;
import world.inclub.membershippayment.domain.dto.response.SuscriptionResponse;
import world.inclub.membershippayment.domain.dto.response.UserResponse;
import world.inclub.membershippayment.domain.entity.SubscriptionBeneficiary;
import world.inclub.membershippayment.infraestructure.apisExternas.account.AccountService;
import world.inclub.membershippayment.infraestructure.apisExternas.account.dtos.UserAccountResponse;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.AdminPanelService;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.PackageDTO;
import world.inclub.membershippayment.infraestructure.apisExternas.notification.NotificationService;



import static net.sf.jsqlparser.util.validation.metadata.NamedObject.user;

@Service
@Slf4j
public class SubscriptionBeneficiaryService {

    @Autowired
    private SubscriptionBeneficiaryDao subscriptionBeneficiaryDao;

    @Autowired
    private SuscriptionService suscriptionService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AccountService accountService;

    @Autowired
    private AdminPanelService adminPanelService;

    public Flux<SubscriptionBeneficiary> gellAl(){
        return subscriptionBeneficiaryDao.findAll();
    }

    public Mono<SubscriptionBeneficiary> getById(Long id){
        return subscriptionBeneficiaryDao.findById(id);
    }

    public Mono<SubscriptionBeneficiary> saveBeneficiary(SubscriptionBeneficiary beneficiary){
        // Logica de validación adicional si es necesario
        // cantidad de beneficiarios por suscripción o por usuario
        // Validar que no se exceda el límite permitido
//        return subscriptionBeneficiaryDao.save(beneficiary);

        return subscriptionBeneficiaryDao.save(beneficiary)
                .flatMap( saveBeneficiary ->
                        Mono.zip(
                            accountService.getUserById(beneficiary.getUserId()),
                            accountService.getUserSponsor(beneficiary.getUserId()),
                            suscriptionService.getSubscriptionById(beneficiary.getIdSubscription())
                        )
                        .flatMap( tuple -> {
                            UserAccountResponse user = tuple.getT1();
                            SponsordResponse sponsor = tuple.getT2();
                            SuscriptionResponse suscriptionResponse = tuple.getT3();

                            Mono<PackageDTO> packageDTO =
                                    adminPanelService.getPackageData(suscriptionResponse.getIdPackage(),
                                            suscriptionResponse.getPackageDetailId());

                            UserResponse userResponse = UserResponse.builder()
                                    .idUser(user.getId().intValue())
                                    .name(user.getName())
                                    .lastName(user.getLastName())
                                    .email(user.getEmail()).build();

                            // Aquí puedes usar 'user' , 'sponsor' y 'PpackageDTO' según sea necesario
                            log.info("Usuario: {}", user);
                            log.info("Sponsor: {}", sponsor);
                            log.info("PackageDTO: {}", packageDTO);

                            return packageDTO.flatMap( pkg ->
                                notificationService.sendEmailAlertSponsorBeneficiary(
                                                userResponse,
                                                sponsor,
                                                pkg,
                                                beneficiary,
                                                "create",
                                                "Creación de información de Beneficiario")
                                        .thenReturn(saveBeneficiary)

                            );

                        })
                );

    }

    public Mono<SubscriptionBeneficiary> updateBeneficiary(Long id, SubscriptionBeneficiary beneficiary){
        return subscriptionBeneficiaryDao.findById(id)
                .flatMap(existingBeneficiary -> {
                    existingBeneficiary.setIdSubscription(beneficiary.getIdSubscription());
                    existingBeneficiary.setUserId(beneficiary.getUserId());
                    existingBeneficiary.setDocumentTypeId(beneficiary.getDocumentTypeId());
                    existingBeneficiary.setResidenceCountryId(beneficiary.getResidenceCountryId());
                    existingBeneficiary.setName(beneficiary.getName());
                    existingBeneficiary.setLastName(beneficiary.getLastName());
                    existingBeneficiary.setGender(beneficiary.getGender());
                    existingBeneficiary.setEmail(beneficiary.getEmail());
                    existingBeneficiary.setNroDocument(beneficiary.getNroDocument());
                    existingBeneficiary.setAgeDate(beneficiary.getAgeDate());
                    existingBeneficiary.setStatus(beneficiary.getStatus());
//                    return subscriptionBeneficiaryDao.save(existingBeneficiary);
                    return subscriptionBeneficiaryDao.save(existingBeneficiary)
                            .flatMap( saveBeneficiary ->
                                    Mono.zip(
                                            accountService.getUserById(beneficiary.getUserId()),
                                            accountService.getUserSponsor(beneficiary.getUserId()),
                                            suscriptionService.getSubscriptionById(beneficiary.getIdSubscription())

                                    )
                                            .flatMap( tuple -> {
                                                UserAccountResponse user = tuple.getT1();
                                                SponsordResponse sponsor = tuple.getT2();
                                                SuscriptionResponse suscriptionResponse = tuple.getT3();

                                                Mono<PackageDTO> packageDTO =
                                                        adminPanelService.getPackageData(suscriptionResponse.getIdPackage(),
                                                                suscriptionResponse.getPackageDetailId());

                                                UserResponse userResponse = UserResponse.builder()
                                                        .idUser(user.getId().intValue())
                                                        .name(user.getName())
                                                        .lastName(user.getLastName())
                                                        .email(user.getEmail()).build();

                                                // Aquí puedes usar 'user' , 'sponsor' y 'PpackageDTO' según sea necesario
                                                log.info("Usuario: {}", user);
                                                log.info("Sponsor: {}", sponsor);
                                                log.info("PackageDTO: {}", packageDTO);


                                               return packageDTO.flatMap( pkg ->
                                                        notificationService.sendEmailAlertSponsorBeneficiary(
                                                                        userResponse,
                                                                        sponsor,
                                                                        pkg,
                                                                        beneficiary,
                                                                        "update",
                                                                "Edición de información de Beneficiario")
                                                                .thenReturn(saveBeneficiary)

                                                );
                                            }
                                            )
                            );
                });
    }

    public Mono<Void> deleteBenefociary(Long id){
        return subscriptionBeneficiaryDao.deleteById(id);
    }

    public Flux<SubscriptionBeneficiary> findBySubscriptionId(Long subscriptionId){
        return subscriptionBeneficiaryDao.findBySubscriptionId(subscriptionId);
    }

    public Flux<SubscriptionBeneficiary> findByUserId(Long userId, int page, int size){
        Pageable pageable = PageRequest.of(page, size);
        return subscriptionBeneficiaryDao.findByUserId(userId, pageable);
    }

    private PackageDTO convertToMonoPackageDTO(Mono<PackageDTO> packageDTOMono) {
        return packageDTOMono.blockOptional()
                .orElseThrow( () -> new RuntimeException("No se pudo obtener el PackageDTO") );
    }

    public Mono<Integer> countAllByUserId(Long userId){
        return subscriptionBeneficiaryDao.countByUserId(userId);
    }

}

