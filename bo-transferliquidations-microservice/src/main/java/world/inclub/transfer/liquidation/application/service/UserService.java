package world.inclub.transfer.liquidation.application.service;

import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.r2dbc.core.DatabaseClient;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;
import world.inclub.transfer.liquidation.domain.entity.UserMultiAccount;
import world.inclub.transfer.liquidation.infraestructure.kafka.dtos.request.UserEditRequestDto;
import world.inclub.transfer.liquidation.infraestructure.kafka.dtos.request.UserExternalRequestDto;
import world.inclub.transfer.liquidation.infraestructure.persistence.SuscriptionRepositorylmpl;
import world.inclub.transfer.liquidation.infraestructure.repository.IUserMultiAccountRepository;
import world.inclub.transfer.liquidation.application.service.interfaces.IMembershipService;

@Service
@AllArgsConstructor
@Slf4j
public class UserService {

        private final IUserMultiAccountRepository userMultiAccountRepository;
        private final SuscriptionRepositorylmpl suscriptionRepository;
        private final IMembershipService membershipService;
        @Qualifier("adminPanelWebClient")
        private final org.springframework.web.reactive.function.client.WebClient adminPanelWebClient;
        @Qualifier("secondaryDatabaseClient")
        private final DatabaseClient secondaryDatabaseClient;
        private final DatabaseClient databaseClient;
        private final PaymentLogService paymentLogService;

        public Mono<Boolean> hasMultiAccounts(Long parentId) {
                if (parentId == null)
                        return Mono.just(false);
                return userMultiAccountRepository.findByParentId(parentId).hasElements();
        }

        public Mono<Boolean> isChildAccount(Long childId) {
                if (childId == null)
                        return Mono.just(false);
                return userMultiAccountRepository.findByChildId(childId).hasElement();
        }

        public Flux<UserMultiAccount> getMultiAccountsByParentId(Long parentId) {
                if (parentId == null)
                        return Flux.empty();
                return userMultiAccountRepository.findByParentId(parentId);
        }

        public Mono<String> editUser(Long idsuscription, UserEditRequestDto request) {

                Mono<Void> externalCall = Mono.empty();
                Mono<Void> snapshotMono = (idsuscription != null)
                                ? paymentLogService.snapshotAll(idsuscription.intValue())
                                                .then()
                                                .doOnSubscribe(s -> log.debug(
                                                                "Snapshotting payments for idsuscription={}",
                                                                idsuscription))
                                                .doOnError(ex -> log.warn("Snapshot error for idsuscription {}: {}",
                                                                idsuscription, ex.toString()))
                                : Mono.empty();

                if (request.getTransferType() == 1 || request.getTransferType() == 2) {
                        var userCustomer = request.getUserCustomer();
                        if (userCustomer == null) {
                                return Mono.error(new IllegalArgumentException(
                                                "userCustomer es obligatorio en transferType=1 o 2"));
                        }

                        UserExternalRequestDto externalRequest = new UserExternalRequestDto();
                        externalRequest.setName(userCustomer.getName());
                        externalRequest.setLastName(userCustomer.getLastName());
                        externalRequest.setBirthdate(userCustomer.getBirthdate());
                        externalRequest.setGender(userCustomer.getGender());
                        externalRequest.setIdNationality(userCustomer.getIdNationality());
                        externalRequest.setEmail(userCustomer.getEmail());
                        externalRequest.setNroDocument(userCustomer.getNroDocument());
                        externalRequest.setDistrictAddress(userCustomer.getDistrictAddress());
                        externalRequest.setAddress(userCustomer.getAddress());
                        externalRequest.setCivilState(userCustomer.getCivilState());
                        externalRequest.setNroPhone(userCustomer.getNroPhone());
                        externalRequest.setIdDocument(userCustomer.getIdDocument());
                        externalRequest.setIdResidenceCountry(userCustomer.getIdResidenceCountry());

                        java.time.format.DateTimeFormatter dtf = java.time.format.DateTimeFormatter
                                        .ofPattern("yyyy-MM-dd'T'HH:mm:ss");
                        java.util.Map<String, Object> payload = new java.util.HashMap<>();
                        payload.put("name", externalRequest.getName());
                        payload.put("lastName", externalRequest.getLastName());
                        payload.put("birthdate",
                                        externalRequest.getBirthdate() != null
                                                        ? externalRequest.getBirthdate().format(dtf)
                                                        : null);
                        payload.put("gender", externalRequest.getGender() != null
                                        ? String.valueOf(externalRequest.getGender())
                                                        .substring(0, Math.min(1, String
                                                                        .valueOf(externalRequest.getGender()).length()))
                                        : null);
                        payload.put("idNationality", externalRequest.getIdNationality());
                        payload.put("email", externalRequest.getEmail());
                        payload.put("nroDocument",
                                        externalRequest.getNroDocument() != null
                                                        ? String.valueOf(externalRequest.getNroDocument())
                                                        : null);
                        payload.put("districtAddress", externalRequest.getDistrictAddress());
                        payload.put("address", externalRequest.getAddress());
                        payload.put("idResidenceCountry", externalRequest.getIdResidenceCountry());
                        payload.put("civilState",
                                        externalRequest.getCivilState() != null
                                                        ? String.valueOf(externalRequest.getCivilState())
                                                        : null);
                        payload.put("nroPhone",
                                        externalRequest.getNroPhone() != null
                                                        ? String.valueOf(externalRequest.getNroPhone())
                                                        : null);
                        payload.put("idDocument", externalRequest.getIdDocument());
                        payload.put("id_location", externalRequest.getIdLocation());

                        com.fasterxml.jackson.databind.ObjectMapper om = new com.fasterxml.jackson.databind.ObjectMapper()
                                        .findAndRegisterModules();

                        reactor.core.publisher.Mono<String> payloadJsonMono = reactor.core.publisher.Mono
                                        .fromCallable(() -> om.writeValueAsString(payload))
                                        .subscribeOn(reactor.core.scheduler.Schedulers.boundedElastic())
                                        .doOnNext(json -> log.info("[UserService] adminpanel payload: {}", json))
                                        .onErrorResume(ex -> {
                                                log.warn("Failed to serialize adminpanel payload", ex);
                                                return reactor.core.publisher.Mono.empty();
                                        });

                        externalCall = payloadJsonMono.then(
                                        adminPanelWebClient.put()
                                                        .uri(uriBuilder -> uriBuilder
                                                                        .path("/user/edit/no-auth/{username}")
                                                                        .build(request.getUsername()))
                                                        .bodyValue(payload)
                                                        .retrieve()
                                                        .onStatus(status -> status.is4xxClientError()
                                                                        || status.is5xxServerError(),
                                                                        resp -> resp.bodyToMono(String.class)
                                                                                        .flatMap(body -> {
                                                                                                log.error("[adminpanel] error response body: {}",
                                                                                                                body);
                                                                                                return reactor.core.publisher.Mono
                                                                                                                .error(new RuntimeException(
                                                                                                                                "AdminPanel error: "
                                                                                                                                                + body));
                                                                                        }))
                                                        .bodyToMono(Void.class));

                        externalCall = adminPanelWebClient.put()
                                        .uri(uriBuilder -> uriBuilder.path("/user/edit/{username}")
                                                        .build(request.getUsername()))
                                        .bodyValue(payload)
                                        .retrieve()
                                        .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                                                        resp -> resp.bodyToMono(String.class).flatMap(body -> {
                                                                log.error("[adminpanel] error response body: {}", body);
                                                                return reactor.core.publisher.Mono
                                                                                .error(new RuntimeException(
                                                                                                "AdminPanel error: "
                                                                                                                + body));
                                                        }))
                                        .bodyToMono(Void.class);

                        if (request.getTransferType() == 2 && request.getChildId() != null) {
                                Long childId = request.getChildId();
                                return snapshotMono.then(externalCall)
                                                .then(userMultiAccountRepository.deleteByChildId(childId))
                                                .then(Mono.just("Usuario actualizado y fila eliminada para childId="
                                                                + childId));
                        }

                        return snapshotMono.then(externalCall)
                                        .then(Mono.just("Usuario actualizado correctamente (transferType=1)"));
                }

                if (request.getTransferType() == 3 || request.getTransferType() == 4) {
                        Long newUserId = request.getNewUserId();
                        if (newUserId == null)
                                return Mono.error(new IllegalArgumentException(
                                                "newUserId es obligatorio en transferType=3 o 4"));

                        Mono<Long> resolvedIdsMono;
                        if (idsuscription != null) {
                                resolvedIdsMono = Mono.just(idsuscription);
                        } else {
                                resolvedIdsMono = databaseClient.sql(
                                                "SELECT r.detail FROM bo_rewards.reward_release_log r JOIN bo_account.user u ON r.user_id = u.id WHERE u.username = :username AND r.detail ILIKE '%ID Suscripción:%' LIMIT 1")
                                                .bind("username", request.getUsername())
                                                .map((row, md) -> row.get("detail", String.class))
                                                .first()
                                                .flatMap(detailStr -> {
                                                        if (detailStr == null) {
                                                                log.warn("[editUser] no se encontró detail con 'ID Suscripción' para username={}",
                                                                                request.getUsername());
                                                                return Mono.empty();
                                                        }
                                                        String trimmed = detailStr.trim();
                                                        java.util.regex.Pattern p = java.util.regex.Pattern.compile(
                                                                        "(?i)ID\\s+Suscripci[oó]n\\s*:\\s*(\\d+)\\s*$");
                                                        java.util.regex.Matcher m = p.matcher(trimmed);
                                                        if (!m.find()) {
                                                                log.warn("[editUser] detail no contiene patrón 'ID Suscripción: <n>' para username={}; detail='{}'",
                                                                                request.getUsername(), detailStr);
                                                                return Mono.empty();
                                                        }
                                                        Long extracted = Long.valueOf(m.group(1));
                                                        return Mono.just(extracted);
                                                });
                        }

                        return resolvedIdsMono.flatMap(resolvedIds -> {
                                Mono<Integer> oldUserIdMono = suscriptionRepository
                                                .findByIdsuscription(resolvedIds.intValue())
                                                .switchIfEmpty(Mono.error(new IllegalArgumentException(
                                                                "No existe suscription con idsuscription="
                                                                                + resolvedIds)))
                                                .flatMap(s -> {
                                                        Integer oldUserId = s.getIduser();
                                                        s.setIduser(newUserId.intValue());
                                                        if (oldUserId == null) {
                                                                return suscriptionRepository.save(s)
                                                                                .thenReturn((Integer) null);
                                                        }
                                                        return suscriptionRepository.save(s)
                                                                        .then(membershipService
                                                                                        .transferMembershipToChild(
                                                                                                        oldUserId,
                                                                                                        newUserId.intValue(),
                                                                                                        resolvedIds.intValue())
                                                                                        .thenReturn(oldUserId));
                                                });

                                Mono<Void> updateRewards = databaseClient.sql(
                                                "UPDATE bo_rewards.rewards_suscription SET user_id = :newUser WHERE subscription_id = :subId")
                                                .bind("newUser", newUserId.intValue())
                                                .bind("subId", resolvedIds.intValue()).then();

                                Mono<Void> updateRewardReleaseLog = databaseClient.sql(
                                                "UPDATE bo_rewards.reward_release_log SET user_id = :newUser WHERE detail ILIKE :pattern")
                                                .bind("newUser", newUserId.intValue())
                                                .bind("pattern", "%ID Suscripción:%" + resolvedIds + "%").then();

                                Mono<Void> adjustRewardsUserBalance = oldUserIdMono.flatMap(oldUserId -> {
                                        if (oldUserId == null)
                                                return Mono.empty();
                                        return databaseClient.sql(
                                                        "SELECT rewards_amount FROM bo_rewards.reward_release_log WHERE detail ILIKE :pattern LIMIT 1")
                                                        .bind("pattern", "%ID Suscripción:%" + resolvedIds + "%")
                                                        .map((row, md) -> row.get("rewards_amount",
                                                                        java.math.BigDecimal.class))
                                                        .first()
                                                        .flatMap(amount -> {
                                                                if (amount == null)
                                                                        return Mono.empty();
                                                                Mono<Void> subtract = databaseClient.sql(
                                                                                "UPDATE bo_rewards.rewards_user SET balance_rewards = balance_rewards - :amt WHERE user_id = :uid")
                                                                                .bind("amt", amount)
                                                                                .bind("uid", oldUserId.intValue())
                                                                                .then();
                                                                Mono<Void> addToNew = databaseClient.sql(
                                                                                "UPDATE bo_rewards.rewards_user SET balance_rewards = balance_rewards + :amt WHERE user_id = :newUid")
                                                                                .bind("amt", amount)
                                                                                .bind("newUid", newUserId.intValue())
                                                                                .fetch()
                                                                                .rowsUpdated()
                                                                                .flatMap(updated -> {
                                                                                        if (updated != null
                                                                                                        && updated > 0)
                                                                                                return Mono.empty();
                                                                                        return databaseClient.sql(
                                                                                                        "INSERT INTO bo_rewards.rewards_user (user_id, balance_rewards, created_at, updated_at) VALUES (:uid, :amt, now(), now())")
                                                                                                        .bind("uid", newUserId
                                                                                                                        .intValue())
                                                                                                        .bind("amt", amount)
                                                                                                        .then();
                                                                                });
                                                                return subtract.then(addToNew);
                                                        });
                                });

                                return snapshotMono
                                                .then(Mono.when(oldUserIdMono.then(), updateRewards,
                                                                updateRewardReleaseLog, adjustRewardsUserBalance))
                                                .then(Mono.just("idsuscription " + resolvedIds + " movida a userId="
                                                                + newUserId + " (transferType="
                                                                + request.getTransferType() + ")"));
                        }).switchIfEmpty(snapshotMono.then(Mono.fromCallable(() -> {
                                log.info("[editUser] No se resolvió idsuscription desde reward_release_log para username={}; no se realizaron cambios en rewards/suscription",
                                                request.getUsername());
                                return "No se resolvió idsuscription; no se realizaron cambios en rewards/suscription";
                        })));
                }

                return Mono.just("TransferType no soportado en este flujo");
        }
}
