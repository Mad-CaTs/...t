package world.inclub.membershippayment.infraestructure.apisExternas.commission;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.aplication.dao.PaymentDao;
import world.inclub.membershippayment.aplication.dao.SuscriptionDao;
import world.inclub.membershippayment.domain.entity.Payment;
import world.inclub.membershippayment.domain.entity.Suscription;
import world.inclub.membershippayment.domain.enums.TypeCommission;
import world.inclub.membershippayment.infraestructure.apisExternas.account.AccountService;
import world.inclub.membershippayment.infraestructure.apisExternas.collaborator.CollaboratorService;
import world.inclub.membershippayment.infraestructure.apisExternas.commission.dtos.MembershipTreeCommissionEventRequest;
import world.inclub.membershippayment.infraestructure.config.kafka.constants.KafkaConstants;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommissionService {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final SuscriptionDao               suscriptionDao;
    private final PaymentDao                   paymentDao;
    private final CollaboratorService          collaboratorService;
    private final AccountService               accountService;

    public Mono<Boolean> generateCommission(Suscription suscription) {

        Integer idUser  = suscription.getIdUser();
        Integer idState = suscription.getStatus();

        /* Estado distinto de 1 → jamás genera comisión */
        if (idState == null || idState != 1) {
            log.info("No genera comisión aún : {}", suscription.getIdSuscription());
            return Mono.just(false);
        }

        /* Consultar DNI y validar contra micro-colaboradores */
        return accountService.getUserById(idUser)
                .flatMap(user -> {
                    if (user == null) {
                        log.error("No se pudo obtener el usuario con idUser {}. NO se genera comisión.", idUser);
                        return Mono.just(false);
                    }
                    if (user.getNroDocument() == null || user.getNroDocument().isEmpty()) {
                        log.error("El usuario con idUser {} no tiene DNI registrado. NO se genera comisión.", idUser);
                        return Mono.just(false);
                    }
                    return collaboratorService.isCollaborator(user.getNroDocument());
                })
                .flatMap(isCollab -> {
                    if (Boolean.TRUE.equals(isCollab)) {
                        log.info("Usuario {} ES colaborador → se omite comisión", idUser);
                        return Mono.just(false);
                    }
                    MembershipTreeCommissionEventRequest request = new MembershipTreeCommissionEventRequest();
                    request.setIdSocio(idUser);
                    request.setIdSuscription(suscription.getIdSuscription().intValue());

                    return suscriptionDao.getSuscriptionsByUserId(idUser)
                            .collectList()
                            .flatMap(suscriptions -> {

                                int numSus = suscriptions.size();
                                int typeCommission =
                                        (numSus <= 1) ? TypeCommission.COMMISSION_FIRST_MEMBERSHIP.getValue() :
                                                (numSus == 2) ? TypeCommission.COMMISSION_SECOND_MEMBERSHIP.getValue() :
                                                        TypeCommission.COMMISSION_THIRD_MEMBERSHIP.getValue();

                                request.setTypeCommission(typeCommission);

                                String key = UUID.randomUUID().toString();
                                kafkaTemplate.send(
                                        KafkaConstants.Topic.REQUEST_MEMBERSHIP_TO_TREE,
                                        key,
                                        request
                                );

                                return Mono.just(true);
                            })
                            .onErrorResume(e -> {
                                log.error("Error en el proceso de comisión para usuario {}", idUser, e);
                                return Mono.just(false);
                            });
                });
    }

    public Mono<Boolean> generateCommissionsForPayments(List<Payment> payments, Integer idUser) {

        return Flux.fromIterable(payments)
                .filter(p -> p.getIsInitialQuote() == 1 && p.getIdStatePayment() == 1)
                .collectList()
                .flatMap(filteredPayments -> {

                    if (filteredPayments == null || filteredPayments.isEmpty()) {
                        return Mono.just(false);
                    }

                    int idSuscription = filteredPayments.get(0).getIdSuscription();
                    log.info("Genera comisión por pago – suscripción {}", idSuscription);

                    MembershipTreeCommissionEventRequest request = new MembershipTreeCommissionEventRequest();
                    request.setIdSocio(idUser);
                    request.setIdSuscription(idSuscription);

                    return suscriptionDao.getSuscriptionsByUserId(idUser)
                            .sort(Comparator.comparing(Suscription::getCreationDate))
                            .collectList()
                            .flatMap(suscriptions -> {

                                int position = -1;
                                for (int i = 0; i < suscriptions.size(); i++) {
                                    if (suscriptions.get(i).getIdSuscription() == idSuscription) {
                                        position = i; break;
                                    }
                                }

                                int typeCommission =
                                        (position == 0) ? TypeCommission.COMMISSION_FIRST_MEMBERSHIP.getValue() :
                                                (position == 1) ? TypeCommission.COMMISSION_SECOND_MEMBERSHIP.getValue() :
                                                        TypeCommission.COMMISSION_THIRD_MEMBERSHIP.getValue();

                                /* Pagos de migración */
                                boolean isMigrated = filteredPayments.stream()
                                        .anyMatch(p -> p.getQuoteDescription()
                                                .matches("(?i).*\\bmigra(ción)?\\b.*"));
                                if (isMigrated) {
                                    typeCommission = TypeCommission.COMMISSION_MIGRATION.getValue();
                                }

                                request.setTypeCommission(typeCommission);
                                String key = UUID.randomUUID().toString();

                                filteredPayments.forEach(p ->
                                        kafkaTemplate.send(KafkaConstants.Topic.REQUEST_MEMBERSHIP_TO_TREE, key, request));

                                return Mono.just(true);
                            });
                })
                .switchIfEmpty(Mono.just(false));
    }
}
