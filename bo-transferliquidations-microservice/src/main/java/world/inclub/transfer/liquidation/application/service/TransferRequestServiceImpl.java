package world.inclub.transfer.liquidation.application.service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.HashMap;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.application.service.interfaces.ITransferRequestService;
import world.inclub.transfer.liquidation.domain.entity.TransferOldUser;
import world.inclub.transfer.liquidation.domain.entity.TransferRequest;
import world.inclub.transfer.liquidation.domain.entity.UserCustomer;
import world.inclub.transfer.liquidation.domain.port.ITransferOldUserPort;
import world.inclub.transfer.liquidation.domain.port.ITransferRequestPort;
import world.inclub.transfer.liquidation.domain.port.IUserCustomerPort;
import world.inclub.transfer.liquidation.infraestructure.repository.ITransferRequestRepository;
import world.inclub.transfer.liquidation.domain.enums.TransferStatus;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransferRequestServiceImpl implements ITransferRequestService {

    private final ITransferRequestPort port;
    private final world.inclub.transfer.liquidation.application.service.interfaces.IAcountService accountService;
    private final ITransferOldUserPort transferOldUserPort;
    private final IUserCustomerPort userCustomerPort;
    private final ITransferRequestRepository transferRequestRepository;
    private final WebClient documentWebClient;

    public Mono<String> uploadFile(FilePart file, String folderNumber) {
        return file.content()
                .map(dataBuffer -> {
                    byte[] bytes = new byte[dataBuffer.readableByteCount()];
                    dataBuffer.read(bytes);
                    return bytes;
                })
                .reduce((a, b) -> {
                    byte[] combined = new byte[a.length + b.length];
                    System.arraycopy(a, 0, combined, 0, a.length);
                    System.arraycopy(b, 0, combined, a.length, b.length);
                    return combined;
                })
                .flatMap(bytes -> {
                    return documentWebClient.post()
                            .contentType(MediaType.MULTIPART_FORM_DATA)
                            .body(BodyInserters.fromMultipartData("file", new ByteArrayResource(bytes) {
                                @Override
                                public String getFilename() {
                                    return file.filename();
                                }
                            }).with("folderNumber", folderNumber))
                            .retrieve()
                            .bodyToMono(Map.class)
                            .map(res -> res.get("data") != null ? res.get("data").toString() : null);
                });
    }

    public Mono<TransferRequest> createTransferRequest(
            Integer idUserFrom,
            Integer idUserTo,
            FilePart dniFile,
            FilePart declarationFile) {

        TransferRequest entity = new TransferRequest();
        entity.setIdUserFrom(idUserFrom);
        entity.setIdUserTo(idUserTo);
        entity.setIdTransferType(1);
        entity.setIdTransferStatus(1);
        entity.setRequestDate(LocalDateTime.now());

        Mono<String> dniUrlMono = (dniFile != null) ? uploadFile(dniFile, "dni") : Mono.empty();
        Mono<String> decUrlMono = (declarationFile != null) ? uploadFile(declarationFile, "declaration") : Mono.empty();

        return Mono.zip(dniUrlMono.defaultIfEmpty(null), decUrlMono.defaultIfEmpty(null))
                .flatMap(tuple -> {
                    entity.setDniUrl(tuple.getT1());
                    entity.setDeclarationJuradaUrl(tuple.getT2());
                    return transferRequestRepository.save(entity);
                });
    }

    @Override
    public Mono<TransferRequest> create(TransferRequest request) {
        request.setRequestDate(LocalDateTime.now());
        return port.save(request)
                .flatMap(saved -> {
                    log.debug("Saved TransferRequest id={} childId={}", saved.getIdTransferRequest(),
                            saved.getChildId());
                    if (saved.getIdUserFrom() != null) {

                        Integer userFromId = saved.getIdUserFrom();

                        return userCustomerPort.getFindById(userFromId)

                                .onErrorResume(ex -> {
                                    log.warn("Error consultando UserCustomer id {}: {}. Se omitirá snapshot.",
                                            userFromId, ex.toString());
                                    return Mono.empty();
                                })
                                .flatMap(uc -> persistOldUserSnapshot(saved.getIdTransferRequest(), uc)
                                        .onErrorResume(ex -> {
                                            log.error(
                                                    "Error guardando snapshot transfer_old_user para transfer_request {}",
                                                    saved.getIdTransferRequest(), ex);
                                            return Mono.empty();
                                        })
                                        .thenReturn(saved))
                                .switchIfEmpty(Mono.defer(() -> {
                                    log.warn("UserCustomer no encontrado para idUserFrom {} en transfer_request {}",
                                            userFromId, saved.getIdTransferRequest());
                                    return Mono.just(saved);
                                }));
                    }
                    return Mono.just(saved);
                });
    }

    private Mono<TransferOldUser> persistOldUserSnapshot(Integer idTransferRequest, UserCustomer uc) {
        TransferOldUser tou = new TransferOldUser();
        tou.setIdTransferRequest(idTransferRequest);
        tou.setName(uc.getName());
        tou.setLastName(uc.getLastName());
        tou.setBirthdate(uc.getBirthdate());
        tou.setGender(String.valueOf(uc.getGender()));
        tou.setNationality(String.valueOf(uc.getIdNationality()));
        tou.setEmail(uc.getEmail());
        tou.setNroDocument(uc.getNroDocument());
        tou.setPhone(uc.getNroPhone());
        tou.setCountry(String.valueOf(uc.getIdResidenceCountry()));
        tou.setDistrict(uc.getDistrictAddress());
        tou.setAddress(uc.getAddress());
        tou.setMaritalStatus(uc.getCivilState());
        return transferOldUserPort.save(tou);
    }

    @Override
    public Mono<TransferRequest> getById(Integer id) {
        return port.findById(id);
    }

    @Override
    public Mono<Map<String, Object>> getByIdEnriched(Integer id) {
        return port.findById(id)
                .switchIfEmpty(Mono.error(new RuntimeException("TransferRequest no encontrada")))
                .flatMap(this::enrich);
    }

    @Override
    public Flux<TransferRequest> getAll() {
        return port.findAll();
    }

    @Override
    public Flux<TransferRequest> getByStatus(Integer status) {
        return port.findByIdTransferStatus(status);
    }

    private Mono<Map<String, Object>> enrich(
            world.inclub.transfer.liquidation.domain.entity.TransferRequest tr) {
        Map<String, Object> base = new HashMap<>();
        base.put("idTransferRequest", tr.getIdTransferRequest());
        base.put("idTransferType", tr.getIdTransferType());
        base.put("idMembership", tr.getIdMembership());
        base.put("idUserFrom", tr.getIdUserFrom());
        base.put("idUserTo", tr.getIdUserTo());
        base.put("sponsorId", tr.getSponsorId());
        base.put("idTransferStatus", tr.getIdTransferStatus());
        base.put("approval_date", tr.getApprovalDate());
        base.put("approvational_date", tr.getApprovalDate());
        base.put("approvalDate", tr.getApprovalDate());
        base.put("requestDate", tr.getRequestDate());
        base.put("dni_url", tr.getDniUrl());
        base.put("declaration_jurada_url", tr.getDeclarationJuradaUrl());
        base.put("dni_receptor_url", tr.getDniReceptor());
        base.put("user_to_nombre", tr.getUserToNombre());
        base.put("user_to_apellido", tr.getUserToApellido());
        base.put("user_to_numero_documento", tr.getUserToNumeroDocumento());
        base.put("user_to_tipo_documento", tr.getUserToTipoDocumento());
        base.put("user_to_genero", tr.getUserToGenero());
        base.put("user_to_fecha_nacimiento", tr.getUserToFechaNacimiento());
        base.put("user_to_estado_civil", tr.getUserToEstadoCivil());
        base.put("user_to_nacionalidad", tr.getUserToNacionalidad());
        base.put("user_to_pais_residencia", tr.getUserToPaisResidencia());
        base.put("user_to_distrito", tr.getUserToDistrito());
        base.put("user_to_provincia", tr.getUserToProvincia());
        base.put("user_to_direccion", tr.getUserToDireccion());
        base.put("user_to_correo_electronico", tr.getUserToCorreoElectronico());
        base.put("user_to_celular", tr.getUserToCelular());
        base.put("user_from_nombre", tr.getUserFromNombre());
        base.put("user_from_email", tr.getUserFromCorreoElectronico());
        base.put("sponsor_nombre", tr.getSponsorNombre());
        base.put("user_from_last_name", tr.getUserFromLastName());
        base.put("sponsor_last_name", tr.getSponsorLastName());
        base.put("sponsor_username", tr.getSponsorUsername());
        base.put("username_from", tr.getUsernameFrom());
        base.put("username_to", tr.getUsernameTo());
        base.put("child_id", tr.getChildId());
        base.put("childId", tr.getChildId());
        base.put("name_membership", tr.getNameMembership());
        base.put("name_memberhip", tr.getNameMembership());
        base.put("username_child", tr.getUsernameChild());
        base.put("nameMembership", tr.getNameMembership());
        base.put("usernameChild", tr.getUsernameChild());

    Map<String, Object> defaultRequester = new HashMap<>();
        defaultRequester.put("requester_name", null);
        defaultRequester.put("requester_last_name", null);

    Map<String, Object> defaultSponsor = new HashMap<>();
        defaultSponsor.put("sponsor_name", null);
        defaultSponsor.put("sponsor_last_name", null);
        defaultSponsor.put("sponsor_username", null);

    Map<String, Object> defaultNewPartner = new HashMap<>();
        defaultNewPartner.put("new_partner_name", null);
        defaultNewPartner.put("new_partner_last_name", null);
        defaultNewPartner.put("new_partner_username", null);

    Mono<Map<String, Object>> requesterMono;
        if (tr.getIdUserFrom() != null) {
            log.debug("Enrich: looking up requester account by id {} for transferRequest {}", tr.getIdUserFrom(),
                    tr.getIdTransferRequest());
            requesterMono = accountService.getAccountById(tr.getIdUserFrom())
                    .map(acc -> {
                        Map<String, Object> m = new HashMap<>();
                        m.put("requester_name", acc.getName());
                        m.put("requester_last_name", acc.getLastName());
                        if (tr.getUsernameFrom() == null || tr.getUsernameFrom().isBlank()) {
                            m.put("username_from", acc.getUsername());
                        }
                        return m;
                    })
                    .defaultIfEmpty(defaultRequester)
                    .onErrorResume(e -> {
                        log.warn("Error fetching requester account {}: {}", tr.getIdUserFrom(), e.getMessage());
                        return Mono.just(defaultRequester);
                    });
        } else {
            requesterMono = Mono.just(defaultRequester);
        }

        Mono<Map<String, Object>> sponsorMono = (tr.getSponsorId() != null)
                ? accountService.getAccountById(tr.getSponsorId())
                        .flatMap(acc -> {
                            Map<String, Object> m = new HashMap<>();
                            m.put("sponsor_name", acc.getName());
                            m.put("sponsor_last_name", acc.getLastName());
                            m.put("sponsor_username", acc.getUsername());
                            return Mono.just(m);
                        })
                        .switchIfEmpty(
                                accountService
                                        .resolveSponsor(tr.getIdTransferType(), tr.getIdUserFrom(), null,
                                                tr.getSponsorId())
                                        .flatMap(acc -> {
                                            Map<String, Object> m = new HashMap<>();
                                            m.put("sponsor_name", acc.getName());
                                            m.put("sponsor_last_name", acc.getLastName());
                                            m.put("sponsor_username", acc.getUsername());
                                            return Mono.just(m);
                                        }))
                        .defaultIfEmpty(defaultSponsor)
                        .onErrorResume(e -> {
                            log.warn("Error fetching sponsor account {}: {}", tr.getSponsorId(), e.getMessage());
                            return Mono.just(defaultSponsor);
                        })
                : Mono.just(defaultSponsor);

        sponsorMono = sponsorMono.flatMap(map -> {
            boolean isDefault = map == defaultSponsor || (map.get("sponsorName") == null
                    && map.get("sponsorUsername") == null && map.get("sponsor_name") == null);
            if (isDefault) {
                log.debug(
                        "Enrich: sponsor not found for sponsorId={} idTransferRequest={} — values will be null in response; attempted resolveSponsor fallback",
                        tr.getSponsorId(), tr.getIdTransferRequest());
            }
            return Mono.just(map);
        });

        Mono<Map<String, Object>> newPartnerMono;
        if (tr.getIdUserTo() != null) {
            log.debug("Enrich: looking up newPartner account by id {} for transferRequest {}", tr.getIdUserTo(),
                    tr.getIdTransferRequest());
            newPartnerMono = accountService.getAccountById(tr.getIdUserTo())
                    .map(acc -> {
                        Map<String, Object> m = new HashMap<>();
                        m.put("new_partner_name", acc.getName());
                        m.put("new_partner_last_name", acc.getLastName());
                        m.put("new_partner_username", acc.getUsername());
                        if (tr.getUsernameTo() == null || tr.getUsernameTo().isBlank()) {
                            m.put("username_to", acc.getUsername());
                        }
                        return m;
                    })
                    .defaultIfEmpty(defaultNewPartner)
                    .onErrorResume(e -> {
                        log.warn("Error fetching new partner account {}: {}", tr.getIdUserTo(), e.getMessage());
                        return Mono.just(defaultNewPartner);
                    });
        } else {
            newPartnerMono = Mono.just(defaultNewPartner);
        }

    return Mono.zip(requesterMono, sponsorMono, newPartnerMono)
        .map(tuple -> {
            Map<String, Object> combined = new HashMap<>(base);
            mergeNonNull(combined, tuple.getT1());
            mergeNonNull(combined, tuple.getT2());
            mergeNonNull(combined, tuple.getT3());

                        Object sName = firstNonNull(combined, "sponsor_name", "sponsor_nombre", "sponsorName", "sponsorNombre");
                        if (sName != null && (combined.get("sponsor_name") == null || String.valueOf(combined.get("sponsor_name")).isBlank())) {
                            combined.put("sponsor_name", sName);
                        }

                        Object sLast = firstNonNull(combined, "sponsor_last_name", "sponsorLastName", "sponsor_lastname", "sponsorApellido");
                        if (sLast != null && (combined.get("sponsor_last_name") == null || String.valueOf(combined.get("sponsor_last_name")).isBlank())) {
                            combined.put("sponsor_last_name", sLast);
                        }

                        Object sUser = firstNonNull(combined, "sponsor_username", "sponsorUsername", "sponsor_user", "sponsor_user_name");
                        if (sUser != null && (combined.get("sponsor_username") == null || String.valueOf(combined.get("sponsor_username")).isBlank())) {
                            combined.put("sponsor_username", sUser);
                        }

                    return combined;
                })
                ;

    }

    private Object firstNonNull(Map<String, Object> map, String... keys) {
        if (map == null || keys == null) return null;
        for (String k : keys) {
            if (k == null) continue;
            Object v = map.get(k);
            if (v == null) continue;
            String s = String.valueOf(v);
            if (s != null && !s.isBlank()) return v;
        }
        return null;
    }

    private void mergeNonNull(Map<String, Object> target, Map<String, Object> source) {
        if (target == null || source == null) return;
        for (Map.Entry<String, Object> e : source.entrySet()) {
            Object v = e.getValue();
            if (v == null) continue;
            if (v instanceof String && String.valueOf(v).isBlank()) continue;
            target.put(e.getKey(), v);
        }
    }

    @Override
    public Flux<Map<String, Object>> getByStatusEnriched(Integer status) {
        return port.findByIdTransferStatus(status).flatMapSequential(this::enrich);
    }

    @Override
    public Flux<Map<String, Object>> getByUsernameEnriched(String username) {
        if (username == null || username.trim().isEmpty()) {
            return Flux.empty();
        }
        String normalized = username.trim();
        int pending = TransferStatus.PENDING.getValue();
        return port.findByUsername(normalized)
                .filter(tr -> tr.getIdTransferStatus() != null && tr.getIdTransferStatus().equals(pending))
                .flatMapSequential(this::enrich);
    }

    @Override
    public Flux<Map<String, Object>> getByTypeEnriched(Integer transferType) {
        if (transferType == null) return Flux.empty();
        int pending = TransferStatus.PENDING.getValue();
    if (transferType.equals(5)) {
        return port.findAll()
            .filter(tr -> tr.getIdTransferStatus() != null && tr.getIdTransferStatus().equals(pending))
            .flatMapSequential(this::enrich);
    }

    return port.findByIdTransferType(transferType)
        .filter(tr -> tr.getIdTransferStatus() != null && tr.getIdTransferStatus().equals(pending))
        .flatMapSequential(this::enrich);
    }

    @Override
    public Flux<Map<String, Object>> getByStatusEnrichedSorted(Integer status) {
        return getByStatusEnriched(status).sort((a, b) -> {
            java.time.LocalDateTime da = (java.time.LocalDateTime) a.get("requestDate");
            java.time.LocalDateTime db = (java.time.LocalDateTime) b.get("requestDate");
            if (da == null && db == null) return 0;
            if (da == null) return 1; 
            if (db == null) return -1;
            return db.compareTo(da);
        });
    }

    @Override
    public Flux<Map<String, Object>> getAllEnriched() {
        return port.findAll().flatMapSequential(this::enrich);
    }

    @Override
    public Mono<Map<String, Object>> updateStatusAndEnrich(Integer id,
            Integer newStatus) {
        return port.findById(id)
                .switchIfEmpty(Mono.error(new RuntimeException("TransferRequest no encontrada")))
                .flatMap(req -> {
                    req.setIdTransferStatus(newStatus);
                    return port.save(req);
                })
                .flatMap(this::enrich);
    }

    @Override
    public Mono<TransferRequest> updateStatus(Integer id, Integer newStatus) {
        return port.findById(id)
                .switchIfEmpty(Mono.error(new RuntimeException("TransferRequest no encontrada")))
                .flatMap(req -> {
                    req.setIdTransferStatus(newStatus);
                    if (newStatus != null) {
                        if (newStatus.equals(TransferStatus.ACCEPTED.getValue()) ||
                                newStatus.equals(TransferStatus.REJECTED.getValue()) ||
                                newStatus.equals(TransferStatus.OBSERVED.getValue()) ||
                                newStatus.equals(TransferStatus.REVERTED.getValue())) {
                            req.setApprovalDate(LocalDateTime.now());
                        }
                    }
                    return port.save(req);
                });
    }

    @Override
    public Flux<Map<String, Object>> getHistoryEnrichedSorted() {
        var flux1 = getByStatusEnriched(1);
        var flux2 = getByStatusEnriched(2);
        var flux3 = getByStatusEnriched(3);
        var flux4 = getByStatusEnriched(4);
    return Flux
        .concat(flux1, flux2, flux3, flux4)
                .sort((a, b) -> {
                    java.time.LocalDateTime da = extractApprovalDate(a);
                    java.time.LocalDateTime db = extractApprovalDate(b);
                    if (da == null && db == null)
                        return 0;
                    if (da == null)
                        return 1; // nulls al final
                    if (db == null)
                        return -1;
                    return db.compareTo(da); // descendente
                });
    }

    private static java.time.LocalDateTime extractApprovalDate(Map<String, Object> m) {
        if (m == null)
            return null;
        Object v = m.get("approval_date");
        if (v == null)
            v = m.get("approvalDate");
        if (v == null)
            v = m.get("approvational_date");
        if (v == null)
            return null;
        if (v instanceof java.time.LocalDateTime)
            return (java.time.LocalDateTime) v;
        if (v instanceof CharSequence) {
            try {
                return java.time.LocalDateTime.parse(v.toString());
            } catch (Exception ignore) {
                return null;
            }
        }
        return null;
    }

}
