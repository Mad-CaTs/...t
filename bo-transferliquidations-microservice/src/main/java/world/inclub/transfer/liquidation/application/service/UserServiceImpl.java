package world.inclub.transfer.liquidation.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import world.inclub.transfer.liquidation.application.service.interfaces.IUserService;
import world.inclub.transfer.liquidation.infraestructure.repository.UserRepository;
import world.inclub.transfer.liquidation.domain.entity.User;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.r2dbc.core.DatabaseClient;

import java.util.Map;
import world.inclub.transfer.liquidation.domain.enums.State;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import world.inclub.transfer.liquidation.domain.entity.UserCustomer;
import world.inclub.transfer.liquidation.application.service.interfaces.IUserCustomerService;
import org.springframework.context.annotation.Lazy;
import world.inclub.transfer.liquidation.domain.port.IUserCustomerPort;
import world.inclub.transfer.liquidation.infraestructure.exception.common.ResourceNotFoundException;
import world.inclub.transfer.liquidation.application.service.interfaces.ITransferRequestService;
import world.inclub.transfer.liquidation.infraestructure.apisExternas.transfer.TransferService;
import world.inclub.transfer.liquidation.infraestructure.apisExternas.transfer.request.EditUserRequest;
import world.inclub.transfer.liquidation.application.service.interfaces.IMembershipService;
import world.inclub.transfer.liquidation.application.service.interfaces.IPaymentService;
import world.inclub.transfer.liquidation.infraestructure.repository.IUserMultiAccountRepository;
import world.inclub.transfer.liquidation.application.service.interfaces.IAcountService;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements IUserService {

    private final UserRepository userRepository;
    private final @Lazy IUserCustomerService userCustomerService;
    private final IUserCustomerPort iUserCustomerPort;
    private final IUserMultiAccountRepository userMultiAccountRepository;
    private final ITransferRequestService transferRequestService;
    private final IMembershipService membershipService;
    private final TransferService transferService;
    private final IAcountService accountService;
    private final IPaymentService paymentService;

    // Inject secondary DatabaseClient for secondary DB operations
    private final DatabaseClient secondaryDatabaseClient;

    @Autowired(required = false)
    private KafkaTemplate<String, Object> kafkaTemplatePayment;

    @Override
    public Flux<User> findAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Mono<User> findById(Integer id) {
        return userRepository.findById(id);
    }

    /**
     * Update iduser in suscription table in secondary DB
     */
    public Mono<Long> updateSuscriptionUserId(Long suscriptionId, Integer newUserId) {
        if (suscriptionId == null || newUserId == null) return Mono.error(new IllegalArgumentException("suscriptionId and newUserId required"));
    // Target the 'public.suscription' table in the dev_bo_admin (admin) database
    String sql = "UPDATE public.suscription SET iduser = $1 WHERE id = $2";
    log.info("[updateSuscriptionUserId] executing SQL='{}' params=[newUserId={}, idsuscription={}] against secondary DB (admin)", sql, newUserId, suscriptionId);
    // Use positional bind indexes (0 -> $1, 1 -> $2) and convert Long -> int for the id column
    return secondaryDatabaseClient.sql(sql)
        .bind(0, newUserId)
        .bind(1, suscriptionId.intValue())
        .fetch()
    .rowsUpdated()
    .map(i -> i.longValue())
        .doOnNext(r -> log.info("[updateSuscriptionUserId] rowsUpdated={} for idsuscription={}", r, suscriptionId))
        .onErrorResume(ex -> {
            log.error("[updateSuscriptionUserId] error updating suscription.iduser for idsuscription={}: {}", suscriptionId, ex.toString());
            // Do not fail the whole business flow because of secondary DB update issues
            return Mono.just(0L);
        });
    }

    @Override
    public Mono<User> findUserByUserName(String userName) {
        return userRepository.findByUsername(userName);
    }

    @Override
    public Mono<Boolean> existsUserById(Integer idUser) {
        return userRepository.existsById(idUser);
    }

    @Override
    public Mono<User> saveUser(User user) {
        return userRepository.save(user)
                .doOnSuccess(savedUser -> {
                    if (savedUser == null || kafkaTemplatePayment == null) return;
                    try {
                        Map<String, Object> payload = Map.of(
                                "idUser", savedUser.getId(),
                                "userName", savedUser.getUsername(),
                                "name", savedUser.getName(),
                                "lastName", savedUser.getLastName()
                        );
                        kafkaTemplatePayment.send("topic-saved-account", payload);

                        Map<String, Object> treePayload = Map.of(
                                "idUser", savedUser.getId(),
                                "idSponsor", null
                        );
                        kafkaTemplatePayment.send("topic-user-transfer-tree", String.valueOf(savedUser.getId()), treePayload);
                    } catch (Exception ex) {
                        log.warn("Kafka send failed", ex);
                    }
                });
    }

    @Override
    public Mono<Void> delete(User user) {
        return userRepository.delete(user);
    }

    @Override
    public Mono<User> updateUserByUsername(String username, String name, String lastName, Integer idState, Boolean isPromoter, String newUsername) {
        return userRepository.findByUsername(username)
                .flatMap(existing -> {
                    if (name != null) existing.setName(name);
                    if (lastName != null) existing.setLastName(lastName);
                    if (newUsername != null && !newUsername.isBlank()) existing.setUsername(newUsername);
                    if (idState != null) {
                        State newState = null;
                        for (State s : State.values()) {
                            if (s.getValue() == idState) { newState = s; break; }
                        }
                        if (newState != null) existing.setIdState(newState);
                    }
                    if (isPromoter != null) existing.setIsPromoter(isPromoter);
                    return userRepository.save(existing);
                });
    }

    @Override
    public Mono<ResponseEntity<Map<String, String>>> updateUser(String username, UserCustomer updatedUser, Integer transferType, Integer multiCode, Integer idMembership) {
        return findUserByUserName(username)
            .switchIfEmpty(Mono.error(new ResourceNotFoundException("No se encontró la cuenta para el usuario: " + username)))
            .flatMap(foundUser -> userCustomerService.getFindById(foundUser.getId())
                .switchIfEmpty(Mono.error(new ResourceNotFoundException("No se encontró el perfil (UserCustomer) para el usuario: " + username)))
                .flatMap(existingCustomer -> {
                    Mono<ResponseEntity<Map<String, String>>> resultMono;

                    if (transferType == null) {
                        log.warn("[updateUser] transferType null recibido para username={}", username);
                        return badRequest("transferType es requerido");
                    }


                    switch (transferType) {
                        case 1:
                            world.inclub.transfer.liquidation.infraestructure.apisExternas.account.entity.User extUser = new world.inclub.transfer.liquidation.infraestructure.apisExternas.account.entity.User();
                            extUser.setName(updatedUser.getName());
                            extUser.setLastName(updatedUser.getLastName());
                            extUser.setEmail(updatedUser.getEmail());
                            if (updatedUser.getBirthdate() != null) {
                                extUser.setBirthDate(updatedUser.getBirthdate());
                            }
                            if (updatedUser.getGender() != null) {
                                // Pass gender exactly as received (no mapping). The field in extUser is a String.
                                extUser.setGender(String.valueOf(updatedUser.getGender()));
                            }
                            extUser.setIdNationality(updatedUser.getIdNationality());
                            extUser.setNroDocument(updatedUser.getNroDocument());
                            extUser.setDistrictAddress(updatedUser.getDistrictAddress());
                            extUser.setAddress(updatedUser.getAddress());
                            extUser.setIdResidenceCountry(updatedUser.getIdResidenceCountry());
                            // Parse civilState safely: if it's not numeric (e.g. "M"), log and set null rather than throwing
                            Integer civilStateParsed = null;
                            if (updatedUser.getCivilState() != null) {
                                String cs = updatedUser.getCivilState().trim();
                                try {
                                    civilStateParsed = Integer.valueOf(cs);
                                } catch (NumberFormatException nfe) {
                                    log.warn("Invalid civilState '{}' for username {}: not numeric, ignoring and leaving null", cs, username);
                                }
                            }
                            extUser.setCivilState(civilStateParsed);
                            extUser.setNroPhone(updatedUser.getNroPhone());
                            extUser.setIdTypeDocument(updatedUser.getIdDocument());

                EditUserRequest userReq = EditUserRequest.builder()
                    .name(extUser.getName())
                    .lastName(extUser.getLastName())
                    .birthdate(extUser.getBirthDate())
                    .gender(extUser.getGender())
                    .idNationality(extUser.getIdNationality())
                    .email(extUser.getEmail())
                    .nroDocument(extUser.getNroDocument())
                    .districtAddress(extUser.getDistrictAddress())
                    .address(extUser.getAddress())
                    .idResidenceCountry(extUser.getIdResidenceCountry())
                    .civilState(extUser.getCivilState() == null ? null : String.valueOf(extUser.getCivilState()))
                    .nroPhone(extUser.getNroPhone())
                    .idDocument(extUser.getIdTypeDocument())
                    .build();

                resultMono = transferService.editUser(username, userReq)
                    .map(resp -> ResponseEntity.ok(Map.of("response", "Perfil actualizado remotamente")))
                    .onErrorResume(ex -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("response", "Error remoto tipo 1: " + ex.getMessage()))));
                            break;
                        case 2:
                            String destUsername2 = updatedUser.getUserName();
                            log.info("[updateUser] Ejecutando flujo tipo 2 (transferencia + update) para username={} -> destUsername={} multiCode={} ", username, destUsername2, multiCode);
                            if (destUsername2 == null || destUsername2.isBlank()) {
                                return badRequest("Para transferType=2, userName en el body es requerido (cuenta destino)");
                            }
                            if (multiCode == null) {
                                return badRequest("Para transferType=2, multiCode es requerido (sub_account_number)");
                            }
                            resultMono = runType2Flow(foundUser.getId(), destUsername2, multiCode);
                            break;
                        case 3:
                            String destUsername3 = updatedUser != null ? updatedUser.getUserName() : null;
                            if (destUsername3 == null || destUsername3.isBlank()) {
                                return badRequest("Para transferType=3, userCustomer.userName (destino) es requerido en el body");
                            }
                            if (idMembership == null) {
                                return badRequest("Para transferType=3, idMembership es requerido en el body");
                            }

                            resultMono = findUserByUserName(destUsername3)
                                .switchIfEmpty(Mono.error(new ResourceNotFoundException("userName destino no existe en bo_account.user: " + destUsername3)))
                                .flatMap(destUser -> {
                                    // Update suscription.iduser in secondary DB
                                    Mono<Long> updateMono = updateSuscriptionUserId(Long.valueOf(idMembership), destUser.getId());
                                    return updateMono.flatMap(rows -> {
                                        return membershipService.transferMembershipToChild(foundUser.getId(), destUser.getId(), idMembership)
                                            .flatMap(updatedMembership -> {
                                                world.inclub.transfer.liquidation.domain.entity.TransferRequest tr = new world.inclub.transfer.liquidation.domain.entity.TransferRequest();
                                                tr.setIdTransferType(3);
                                                tr.setIdUserFrom(foundUser.getId());
                                                tr.setIdUserTo(destUser.getId());
                                                tr.setIdMembership(idMembership);
                                                tr.setIdTransferStatus(1);
                                                return transferRequestService.create(tr)
                                                    .thenReturn(ResponseEntity.ok(Map.of(
                                                        "response", "Membresía " + idMembership + " transferida de " + username + " a " + destUsername3 + " (suscription.iduser actualizado en segunda BD)"
                                                    )));
                                            });
                                    });
                                });
                            break;
                        case 4:
                            String destUsername4 = updatedUser != null ? updatedUser.getUserName() : null;
                            if (destUsername4 == null || destUsername4.isBlank()) {
                                return badRequest("Para transferType=4, userCustomer.userName (destino) es requerido en el body");
                            }
                            if (idMembership == null) {
                                return badRequest("Para transferType=4, idMembership es requerido en el body");
                            }

                            resultMono = findUserByUserName(destUsername4)
                                .switchIfEmpty(Mono.error(new ResourceNotFoundException("userName destino no existe en bo_account.user: " + destUsername4)))
                                .flatMap(destUser -> {
                                    // Update suscription.iduser in secondary DB
                                    Mono<Long> updateMono = updateSuscriptionUserId(Long.valueOf(idMembership), destUser.getId());
                                    return updateMono.flatMap(rows -> {
                                        return membershipService.transferMembershipToChild(foundUser.getId(), destUser.getId(), idMembership)
                                            .flatMap(updatedMembership -> {
                                                world.inclub.transfer.liquidation.domain.entity.TransferRequest tr = new world.inclub.transfer.liquidation.domain.entity.TransferRequest();
                                                tr.setIdTransferType(4);
                                                tr.setIdUserFrom(foundUser.getId());
                                                tr.setIdUserTo(destUser.getId());
                                                tr.setIdMembership(idMembership);
                                                tr.setIdTransferStatus(1);
                                                return transferRequestService.create(tr)
                                                    .thenReturn(ResponseEntity.ok(Map.of(
                                                        "response", "Membresía " + idMembership + " transferida (tipo 4) de " + username + " a " + destUsername4 + " (suscription.iduser actualizado en segunda BD)"
                                                    )));
                                            });
                                    });
                                });
                            break;
                        default:
                            return badRequest("transferType inválido");
                    }

                    return resultMono;
                })
            );
    }

    @Override
    public reactor.core.publisher.Flux<java.util.Map<String, Object>> getEnrichedMultiAccountsByParentId(Long parentId) {
        if (parentId == null) return reactor.core.publisher.Flux.empty();

        return userMultiAccountRepository.findByParentId(parentId)
                .flatMap(uma -> {
                    java.util.Map<String, Object> item = new java.util.HashMap<>();
                    item.put("id_multi_account", uma.getIdMultiAccount());
                    item.put("parent_id", uma.getParentId());
                    item.put("child_id", uma.getChildId());
                    item.put("sub_account_number", uma.getSubAccountNumber());
                    item.put("created_at", uma.getCreatedAt());

                    if (uma.getChildId() == null) {
                        item.put("username", null);
                        return Mono.just(item);
                    }

                    Integer childIdInt = uma.getChildId() == null ? null : uma.getChildId().intValue();
                    if (childIdInt == null) {
                        item.put("username", null);
                        return Mono.just(item);
                    }

                    return accountService.getAccountById(childIdInt)
                            .map(acc -> {
                                item.put("username", acc != null ? acc.getUsername() : null);
                                return item;
                            })
                            .defaultIfEmpty(item);
                });
    }

    @Override
    public reactor.core.publisher.Mono<java.util.List<java.util.Map<String, Object>>> getEnrichedSubscriptionsByUsername(String username) {
        if (username == null || username.trim().isEmpty()) return Mono.just(java.util.List.of());

        String normalized = username.trim();

        return accountService.getAccountByUsername(normalized)
                .flatMap(acc -> membershipService.getMembershipsByUserId(acc.getId()).collectList()
                        .flatMap(list -> {
                            if (list == null || list.isEmpty()) {
                                return Mono.just(java.util.List.<java.util.Map<String,Object>>of());
                            }

                            return reactor.core.publisher.Flux.fromIterable(list)
                                    .flatMap(mem -> {
                                        Integer candidateId = null;
                                        if (mem != null && mem.getMembership() != null) {
                                            for (var pkg : mem.getMembership()) {
                                                if (pkg == null) continue;
                                                if (pkg.getIdMembership() != null && pkg.getIdMembership() > 0) {
                                                    candidateId = pkg.getIdMembership();
                                                    break;
                                                }
                                                if (pkg.getPay() != null && pkg.getPay() > 0) {
                                                    candidateId = pkg.getPay();
                                                    break;
                                                }
                                            }
                                        }

                                        java.util.Map<String, Object> enriched = new java.util.HashMap<>();
                                        enriched.put("membership", mem);

                                        if (candidateId == null) {
                                            enriched.put("id_payment", null);
                                            return Mono.just(enriched);
                                        }

                                        return paymentService.getFindById(candidateId)
                                                .map(payment -> {
                                                    enriched.put("id_payment", payment != null ? payment.getIdPayment() : null);
                                                    return enriched;
                                                })
                                                .defaultIfEmpty(enriched);
                                    }).collectList();
                        }))
                .defaultIfEmpty(java.util.List.of());
    }


    private Mono<ResponseEntity<Map<String, String>>> badRequest(String message) {
        return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("response", message)));
    }

    private Mono<ResponseEntity<Map<String, String>>> runType2Flow(Integer parentUserId, String destUsername, Integer multiCode) {
        Mono<Void> transferFlow = findUserByUserName(destUsername)
            .switchIfEmpty(Mono.error(new ResourceNotFoundException("userName destino no existe en bo_account.user: " + destUsername)))
            .flatMap(destUser -> userMultiAccountRepository
                .findByParentIdAndSubAccountNumber(parentUserId.longValue(), multiCode)
                .switchIfEmpty(Mono.error(new ResourceNotFoundException(
                    "No existe multi-código " + multiCode + " para parentId=" + parentUserId)))
                .flatMap(uma -> userMultiAccountRepository.delete(uma).thenReturn(uma))
                .flatMap(uma -> {
                    Integer childId = uma.getChildId().intValue();

                    Mono<?> copyUserMono = findById(destUser.getId())
                        .zipWith(findById(childId))
                        .flatMap(tuple -> {
                            var destUserLoaded = tuple.getT1();
                            var childUser = tuple.getT2();
                            childUser.setName(destUserLoaded.getName());
                            childUser.setLastName(destUserLoaded.getLastName());
                            return saveUser(childUser);
                        });

                    Mono<?> copyUserCustomerMono = userCustomerService.getFindById(destUser.getId())
                        .zipWith(userCustomerService.getFindById(childId))
                        .flatMap(t -> {
                            var destUc = t.getT1();
                            var childUc = t.getT2();
                            childUc.setName(destUc.getName());
                            childUc.setLastName(destUc.getLastName());
                            childUc.setBirthdate(destUc.getBirthdate());
                            childUc.setGender(destUc.getGender());
                            childUc.setIdNationality(destUc.getIdNationality());
                            childUc.setEmail(destUc.getEmail());
                            childUc.setNroDocument(destUc.getNroDocument());
                            childUc.setDistrictAddress(destUc.getDistrictAddress());
                            childUc.setAddress(destUc.getAddress());
                            childUc.setIdResidenceCountry(destUc.getIdResidenceCountry());
                            childUc.setCivilState(destUc.getCivilState());
                            childUc.setNroPhone(destUc.getNroPhone());
                            childUc.setIdDocument(destUc.getIdDocument());
                            return iUserCustomerPort.updateUserCustomer(childId, Mono.just(childUc));
                        });

                    return copyUserMono.then(copyUserCustomerMono).then(Mono.defer(() -> {
                        world.inclub.transfer.liquidation.domain.entity.TransferRequest tr = new world.inclub.transfer.liquidation.domain.entity.TransferRequest();
                        tr.setIdTransferType(2);
                        tr.setIdUserFrom(parentUserId);
                        tr.setIdUserTo(destUser.getId());
                        tr.setIdMembership(multiCode);
                        tr.setIdTransferStatus(1);
                        return transferRequestService.create(tr).then();
                    }));
                }))
            .onErrorResume(ex -> {
                log.error("Error ejecutando lógica tipo 2 en /edit/{username}", ex);
                return Mono.error(ex);
            });

        return transferFlow.thenReturn(ResponseEntity.ok(Map.of(
            "response", "Multicódigo " + multiCode + " desvinculado y cuenta hija actualizada con datos de " + destUsername
        ))).onErrorResume(ex -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of("response", "Error en transferencia tipo 2: " + ex.getMessage()))));
    }
}
