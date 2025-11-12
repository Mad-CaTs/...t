package world.inclub.transfer.liquidation.api.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.api.dtos.RegisterTransferRequest;
import world.inclub.transfer.liquidation.api.dtos.TransferRequestDTO;
import world.inclub.transfer.liquidation.application.service.UserService;
import world.inclub.transfer.liquidation.application.service.interfaces.IAcountService;
import world.inclub.transfer.liquidation.application.service.interfaces.IUserService;
import world.inclub.transfer.liquidation.application.service.interfaces.ITransferService;
import world.inclub.transfer.liquidation.domain.constant.ApiPaths;
import world.inclub.transfer.liquidation.infraestructure.apisExternas.account.AccountService;
import world.inclub.transfer.liquidation.infraestructure.apisExternas.account.request.SuscriptionRequest;
import world.inclub.transfer.liquidation.infraestructure.handler.ResponseHandler;
import world.inclub.transfer.liquidation.infraestructure.kafka.dtos.request.UserEditRequestDto;
import world.inclub.transfer.liquidation.infraestructure.config.kafka.producer.KafkaProducer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import world.inclub.transfer.liquidation.infraestructure.client.AccountApiClient;
import world.inclub.transfer.liquidation.domain.enums.TransferStatus;
import world.inclub.transfer.liquidation.domain.port.IUserCustomerPort;
import world.inclub.transfer.liquidation.application.service.PaymentLogService;
import world.inclub.transfer.liquidation.application.service.interfaces.ITypeTransferService;

@RestController
@Validated
@RequestMapping(ApiPaths.API_BASE_PATH + ApiPaths.NAME_SERVICE_TRANSFER)
@RequiredArgsConstructor
@Slf4j
public class TransferController {

        private static final Pattern USERNAME_PATTERN = Pattern.compile("^[A-Za-z0-9_.@-]{1,100}$");
        private final ITransferService iTransferService;
        private final IAcountService accountService;
        private final IUserService userServiceApp;
        private final AccountService externalAccountService;
        private final AccountApiClient accountApiClient;
        private final world.inclub.transfer.liquidation.application.service.interfaces.ITransferRequestService transferRequestService;
        private final UserService userService;
        private final IUserCustomerPort userCustomerPort;
        private final world.inclub.transfer.liquidation.application.service.interfaces.ITransferRejectionService transferRejectionService;
        private final world.inclub.transfer.liquidation.application.service.interfaces.ITransferObservationService transferObservationService;
        private final world.inclub.transfer.liquidation.application.service.interfaces.ITransferAcceptanceService transferAcceptanceService;
        private final PaymentLogService paymentLogService;
        private final world.inclub.transfer.liquidation.application.service.MembershipService membershipService;
        private final ITypeTransferService typeTransferService;
        private final KafkaProducer kafkaProducer;
        private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules()
                        .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        @PutMapping({ "/edit", "/edit/{idsuscription}" })
        public Mono<ResponseEntity<String>> editUser(
                        @PathVariable(value = "idsuscription", required = false) Long idsuscription,
                        @RequestBody UserEditRequestDto request) {

                log.info("[TransferController] editUser called with idsuscription={}, transferType={}, username={}",
                                idsuscription, request != null ? request.getTransferType() : null,
                                request != null ? request.getUsername() : null);

                if (idsuscription == null && request != null && request.getUsername() != null) {
                        // attempt to resolve account -> memberships -> for each membership run
                        // snapshotAll for its business id
                        return accountService.getAccountByUsername(request.getUsername())
                                        .flatMap(acc -> membershipService.getMembershipsByUserId(acc.getId())
                                                        .collectList())
                                        .flatMap(list -> {
                                                if (list == null || list.isEmpty()) {
                                                        return userService.editUser(idsuscription, request);
                                                }
                                                // For each membership attempt snapshotAll using membership.id (if
                                                // present)
                                                return reactor.core.publisher.Flux.fromIterable(list)
                                                                .flatMap(m -> {
                                                                        Integer mid = m.getId();
                                                                        if (mid == null)
                                                                                return reactor.core.publisher.Mono
                                                                                                .empty();
                                                                        log.info("Pre-snapshot: running paymentLogService.snapshotAll for membership.id={} (user={})",
                                                                                        mid, request.getUsername());
                                                                        return paymentLogService.snapshotAll(mid);
                                                                })
                                                                .then(userService.editUser(idsuscription, request));
                                        })
                                        .map(ResponseEntity::ok)
                                        .defaultIfEmpty(ResponseEntity.notFound().build())
                                        .onErrorResume(ex -> {
                                                log.error("Error resolving pre-snapshot for username {}: {}",
                                                                request.getUsername(), ex.toString());
                                                // fallback to original flow
                                                return userService.editUser(idsuscription, request)
                                                                .map(ResponseEntity::ok)
                                                                .defaultIfEmpty(ResponseEntity.notFound().build());
                                        });
                }

                return userService.editUser(idsuscription, request)
                                .map(ResponseEntity::ok)
                                .defaultIfEmpty(ResponseEntity.notFound().build());
        }

        @PostMapping("/save")
        public Mono<ResponseEntity<Object>> saveTransfer(@RequestBody TransferRequestDTO request) {
                return ResponseHandler.generateResponse(HttpStatus.OK, iTransferService.saveTransfer(request), true);
        }

        @PostMapping("/saveUser")
        public Mono<ResponseEntity<Object>> portRegister(@RequestBody SuscriptionRequest suscriptionRequest) {
                return ResponseHandler.generateResponse(HttpStatus.CREATED,
                                externalAccountService.postRegisterUser(suscriptionRequest).map(Object.class::cast),
                                true);
        }

        @PostMapping(path = "/registerAccountTransfer", consumes = MediaType.APPLICATION_JSON_VALUE)
        public Mono<ResponseEntity<Object>> registerAccountTransfer(@RequestBody RegisterTransferRequest request) {
                if (request == null) {
                        return ResponseHandler.generateMessageResponse(HttpStatus.BAD_REQUEST,
                                        "request es requerido", false);
                }

                return accountApiClient.registerTransfer(request)
                                .flatMap(body -> ResponseHandler.generateResponse(HttpStatus.CREATED,
                                                Mono.just((Object) body), true))
                                .onErrorResume(ex -> {
                                        log.error("Error registrando account transfer", ex);
                                        return ResponseHandler.generateMessageResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                                                        "Error interno al registrar account transfer", false);
                                });
        }

        @GetMapping("/listTransferUser")
        public Mono<ResponseEntity<Object>> listTransferUser(
                        @RequestParam("transferType") Integer transferType,
                        @RequestParam(value = "idUser", required = false) Integer idUser,
                        @RequestParam(value = "sponsorUsername", required = false) String sponsorUsername,
                        @RequestParam(value = "sponsorId", required = false) Integer sponsorId) {

                if (transferType == null) {
                        return ResponseHandler.generateMessageResponse(HttpStatus.BAD_REQUEST,
                                        "transferType es requerido", false);
                }

                Mono<world.inclub.transfer.liquidation.domain.entity.Account> accountMono;

                if (transferType == 1 || transferType == 2 || transferType == 4) {
                        if (idUser == null) {
                                String msg = (transferType == 4) ? "idUser es requerido para transferType 4"
                                                : "idUser es requerido para transferType 1/2";
                                return ResponseHandler.generateMessageResponse(HttpStatus.BAD_REQUEST, msg, false);
                        }
                        if (idUser <= 0) {
                                return ResponseHandler.generateMessageResponse(HttpStatus.BAD_REQUEST,
                                                "idUser debe ser un entero positivo", false);
                        }
                        accountMono = accountService.resolveSponsor(transferType, idUser, null, sponsorId);
                } else if (transferType == 3) {
                        if (isBlank(sponsorUsername)) {
                                return ResponseHandler.generateMessageResponse(HttpStatus.BAD_REQUEST,
                                                "sponsorUsername es requerido para transferType 3", false);
                        }
                        String normalizedSponsor = sponsorUsername.trim();
                        if (!USERNAME_PATTERN.matcher(normalizedSponsor).matches()) {
                                return ResponseHandler.generateMessageResponse(HttpStatus.BAD_REQUEST,
                                                "sponsorUsername contiene caracteres inválidos", false);
                        }
                        accountMono = accountService.resolveSponsor(transferType, null, normalizedSponsor, sponsorId);
                } else {
                        return ResponseHandler.generateMessageResponse(HttpStatus.BAD_REQUEST, "transferType inválido",
                                        false);
                }

                Mono<Map<String, Object>> dataMono = accountMono
                                .flatMap(account -> userServiceApp.findById(account.getId())
                                                .map(user -> {
                                                        Map<String, Object> res = new HashMap<>();
                                                        res.put("sponsor_id", account.getId());
                                                        res.put("sponsor_username", account.getUsername());
                                                        res.put("sponsor_name", account.getName());
                                                        res.put("sponsor_last_name", account.getLastName());
                                                        res.put("id_state",
                                                                        (user != null && user.getIdState() != null)
                                                                                        ? user.getIdState().getValue()
                                                                                        : null);
                                                        return res;
                                                }).defaultIfEmpty(defaultSponsorMap(account)));

                return ResponseHandler.generateResponse(HttpStatus.OK, dataMono.cast(Object.class), true)
                                .switchIfEmpty(ResponseHandler.generateMessageResponse(HttpStatus.NOT_FOUND,
                                                "Patrocinador no encontrado", false))
                                .onErrorResume(ex -> {
                                        log.error("Error en listTransferUser", ex);
                                        return ResponseHandler.generateMessageResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                                                        "Error interno al procesar la solicitud", false);
                                });
        }

        @GetMapping("/subscriptions")
        public Mono<ResponseEntity<Object>> listSubscriptionsByUsername(@RequestParam("username") String username) {
                if (isBlank(username)) {
                        return ResponseHandler.generateMessageResponse(HttpStatus.BAD_REQUEST, "username es requerido",
                                        false);
                }

                String normalized = username.trim();
                if (!USERNAME_PATTERN.matcher(normalized).matches()) {
                        return ResponseHandler.generateMessageResponse(HttpStatus.BAD_REQUEST,
                                        "username contiene caracteres inválidos", false);
                }

                return userServiceApp.getEnrichedSubscriptionsByUsername(normalized)
                                .flatMap(list -> {
                                        if (list == null || list.isEmpty()) {
                                                return ResponseHandler.generateMessageResponse(HttpStatus.NOT_FOUND,
                                                                "No hay membresías para ese usuario", false);
                                        }
                                        return ResponseHandler.generateResponse(HttpStatus.OK, Mono.just(list), true);
                                })
                                .switchIfEmpty(ResponseHandler.generateMessageResponse(HttpStatus.NOT_FOUND,
                                                "Usuario no encontrado", false))
                                .onErrorResume(ex -> {
                                        log.error("Error listando suscripciones para username {}", username, ex);
                                        return ResponseHandler.generateMessageResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                                                        "Error interno", false);
                                });
        }

        @GetMapping("/user/by-username")
        public Mono<ResponseEntity<Object>> getUserByUsername(@RequestParam("username") String username) {
                if (isBlank(username)) {
                        return ResponseHandler.generateMessageResponse(HttpStatus.BAD_REQUEST, "username es requerido",
                                        false);
                }
                String normalized = username.trim();
                log.debug("Searching user by username: {}", normalized);
                return userCustomerPort.findByUsername(normalized)
                                .flatMap(u -> ResponseHandler.generateResponse(HttpStatus.OK, Mono.just(u), true))
                                .switchIfEmpty(ResponseHandler.generateMessageResponse(HttpStatus.NOT_FOUND,
                                                "Usuario no encontrado", false))
                                .onErrorResume(ex -> {
                                        log.error("Error buscando usuario por username {}", username, ex);
                                        String msg = ex.getClass().getSimpleName() + ": "
                                                        + (ex.getMessage() != null ? ex.getMessage() : "(no message)");
                                        return ResponseHandler.generateMessageResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                                                        "Error interno: " + msg, false);
                                });
        }

        @PostMapping("/request")
        public Mono<ResponseEntity<Object>> createTransferRequest(
                        @RequestBody world.inclub.transfer.liquidation.domain.entity.TransferRequest request) {

                if (request == null) {
                        return ResponseHandler.generateMessageResponse(HttpStatus.BAD_REQUEST, "request es requerido",
                                        false);
                }
                if (request.getIdUserFrom() != null && request.getIdUserFrom() <= 0) {
                        return ResponseHandler.generateMessageResponse(HttpStatus.BAD_REQUEST,
                                        "idUserFrom debe ser un entero positivo", false);
                }
                if (request.getIdUserTo() != null && request.getIdUserTo() <= 0) {
                        return ResponseHandler.generateMessageResponse(HttpStatus.BAD_REQUEST,
                                        "idUserTo debe ser un entero positivo", false);
                }

                return transferRequestService.create(request)
                                .map(r -> {
                                        final String topic = "transfer-request-email";
                                        try {
                                                request.setIdTransferRequest(r.getIdTransferRequest());
                                                kafkaProducer.sendMessage(topic, request);
                                        } catch (Exception ex) {
                                                log.error("Exception when delegating kafka send to producer", ex);
                                        }
                                        return ResponseEntity.status(HttpStatus.CREATED).body((Object) r);
                                })
                                .onErrorResume(IllegalArgumentException.class, ex -> {
                                        log.warn("Bad request creating TransferRequest: {}", ex.getMessage());
                                        Map<String, Object> err = new HashMap<>();
                                        err.put("message", ex.getMessage());
                                        err.put("type", "BadRequest");
                                        return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                                        .body((Object) err));
                                }).onErrorResume(ex -> {
                                        log.error("Error creando TransferRequest", ex);
                                        Map<String, Object> err = new HashMap<>();
                                        err.put("message", "Error interno al crear transferencia");
                                        err.put("errorClass", ex.getClass().getName());
                                        err.put("errorMessage", ex.getMessage());
                                        return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                                        .body((Object) err));
                                });
        }

        @GetMapping("/history")
        public Mono<ResponseEntity<Object>> getHistory() {
                return ResponseHandler.generateResponse(HttpStatus.OK,
                                transferRequestService.getHistoryEnrichedSorted(), true)
                                .onErrorResume(ex -> {
                                        log.error("Error fetching history transfers", ex);
                                        return ResponseHandler.generateMessageResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                                                        "Error interno al obtener histórico", false);
                                });
        }

        @GetMapping("/request/{id:\\d+}")
        public Mono<ResponseEntity<Object>> getTransferRequestById(@PathVariable("id") Integer id) {
                if (id == null) {
                        return ResponseHandler.generateMessageResponse(HttpStatus.BAD_REQUEST, "id es requerido",
                                        false);
                }

                return transferRequestService.getByIdEnriched(id)
                                .flatMap(map -> ResponseHandler.generateResponse(HttpStatus.OK, Mono.just(map), true))
                                .onErrorResume(RuntimeException.class,
                                                ex -> ResponseHandler.generateMessageResponse(HttpStatus.NOT_FOUND,
                                                                ex.getMessage(), false))
                                .onErrorResume(ex -> {
                                        log.error("Error obteniendo TransferRequest {}", id, ex);
                                        return ResponseHandler.generateMessageResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                                                        "Error interno al obtener transferRequest", false);
                                });
        }

        @GetMapping("/request/by-username")
        public Mono<ResponseEntity<Object>> getRequestsByUsername(@RequestParam("username") String username) {
                if (isBlank(username)) {
                        return ResponseHandler.generateMessageResponse(HttpStatus.BAD_REQUEST, "username es requerido",
                                        false);
                }
                String normalized = username.trim();
                if (!USERNAME_PATTERN.matcher(normalized).matches()) {
                        return ResponseHandler.generateMessageResponse(HttpStatus.BAD_REQUEST,
                                        "username contiene caracteres inválidos", false);
                }

                return ResponseHandler.generateResponse(HttpStatus.OK,
                                transferRequestService.getByUsernameEnriched(normalized).collectList().map(Object.class::cast),
                                true)
                                .onErrorResume(ex -> {
                                        log.error("Error buscando TransferRequests por username {}", username, ex);
                                        return ResponseHandler.generateMessageResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                                                        "Error interno", false);
                                });
        }

        @GetMapping("/request/by-type")
        public Mono<ResponseEntity<Object>> getRequestsByType() {
                return typeTransferService.getAllTransfer()
                                .map(tt -> {
                                        java.util.Map<String, Object> m = new java.util.HashMap<>();
                                        m.put("id", tt.getIdTypeTransfer());
                                        m.put("name", tt.getName());
                                        return m;
                                })
                                .collectList()
                                .map(list -> {
                                        if (list == null) list = new java.util.ArrayList<>();
                                        java.util.Map<String, Object> todos = new java.util.HashMap<>();
                                        todos.put("id", 5);
                                        todos.put("name", "todos");
                                        list.add(0, todos);
                                        return list;
                                })
                                .flatMap(list -> ResponseHandler.generateResponse(HttpStatus.OK, Mono.just(list).cast(Object.class), true))
                                .onErrorResume(ex -> {
                                        log.error("Error obteniendo tipos de traspaso", ex);
                                        return ResponseHandler.generateMessageResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                                                        "Error interno", false);
                                });
        }

        @GetMapping("/multicodes/{parentId}")
        public Mono<ResponseEntity<Object>> listMulticodesByParentId(@PathVariable("parentId") Long parentId) {
                if (parentId == null) {
                        return ResponseHandler.generateMessageResponse(HttpStatus.BAD_REQUEST, "parentId es requerido",
                                        false);
                }

                return userServiceApp.getEnrichedMultiAccountsByParentId(parentId)
                                .collectList()
                                .flatMap(list -> {
                                        if (list == null || list.isEmpty()) {
                                                return ResponseHandler.generateMessageResponse(HttpStatus.NOT_FOUND,
                                                                "No hay multicódigos para ese parentId", false);
                                        }
                                        return ResponseHandler.generateResponse(HttpStatus.OK, Mono.just(list), true);
                                })
                                .onErrorResume(ex -> {
                                        log.error("Error listando multicódigos para parentId {}", parentId, ex);
                                        return ResponseHandler.generateMessageResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                                                        "Error interno", false);
                                });
        }

        @PostMapping(path = "/rejection-types", consumes = MediaType.APPLICATION_JSON_VALUE)
        public Mono<ResponseEntity<Object>> upsertRejectionTypes(
                        @RequestBody(required = false) Map<String, Object> body) {
                if (body == null || body.isEmpty()) {
                        return ResponseHandler.generateResponse(HttpStatus.OK,
                                        transferRejectionService.listTypes().collectList().map(Object.class::cast),
                                        true)
                                        .onErrorResume(ex -> {
                                                log.error("Error fetching rejection types via service", ex);
                                                return ResponseHandler.generateMessageResponse(
                                                                HttpStatus.INTERNAL_SERVER_ERROR,
                                                                "Error interno", false);
                                        });
                }
                Integer idTransferRequest = body.containsKey("id_transfer_request")
                                ? parseInteger(body.get("id_transfer_request"))
                                : null;
                Integer idType = body.containsKey("id_transfer_rejection_type")
                                ? parseInteger(body.get("id_transfer_rejection_type"))
                                : null;
                String detail = body.containsKey("detail_rejection_transfer")
                                ? String.valueOf(body.get("detail_rejection_transfer"))
                                : null;

                world.inclub.transfer.liquidation.api.dtos.TransferRejectionRequest req = new world.inclub.transfer.liquidation.api.dtos.TransferRejectionRequest();
                req.setIdTransferRequest(idTransferRequest);
                req.setIdTransferRejectionType(idType);
                req.setDetailRejectionTransfer(detail);

                return transferRejectionService.create(req)
                                .flatMap(r -> transferRequestService
                                                .updateStatus(r.getIdTransferRequest(), TransferStatus.REJECTED.getValue())
                                                .then(transferRequestService.getByIdEnriched(r.getIdTransferRequest())
                                                                .map(enriched -> {
                                                                        Map<String, Object> rejection = new HashMap<>();
                                                                        rejection.put("id", r.getId());
                                                                        rejection.put("idTransferRequest",
                                                                                        r.getIdTransferRequest());
                                                                        rejection.put("idTransferRejectionType",
                                                                                        r.getIdTransferRejectionType());
                                                                        rejection.put("detailRejectionTransfer",
                                                                                        r.getDetailRejectionTransfer());
                                                                        rejection.put("rejectedTransferAt",
                                                                                        r.getRejectedTransferAt());

                                                                        Map<String, Object> combined = new HashMap<>();
                                                                        combined.put("rejection", rejection);
                                                                        combined.put("transferRequest", enriched);
                                                                        return combined;
                                                                }))
                                                .flatMap(data -> ResponseHandler.generateResponse(HttpStatus.CREATED,
                                                                Mono.just((Object) data), true)))
                                .onErrorResume(IllegalArgumentException.class, ex -> {
                                        log.warn("Bad request creating transfer rejection: {}", ex.getMessage());
                                        return ResponseHandler.generateMessageResponse(HttpStatus.BAD_REQUEST,
                                                        ex.getMessage(), false);
                                }).onErrorResume(ex -> {
                                        log.error("Error inserting transfer_rejection via service", ex);
                                        return ResponseHandler.generateMessageResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                                                        "Error interno al insertar rechazo", false);
                                });
        }

        @PostMapping(path = "/observation-types", consumes = MediaType.APPLICATION_JSON_VALUE)
        public Mono<ResponseEntity<Object>> upsertObservationTypes(
                        @RequestBody(required = false) Map<String, Object> body) {
                if (body == null || body.isEmpty()) {
                        return ResponseHandler.generateResponse(HttpStatus.OK,
                                        transferObservationService.listTypes().collectList().map(Object.class::cast),
                                        true)
                                        .onErrorResume(ex -> {
                                                log.error("Error fetching observation types via service", ex);
                                                return ResponseHandler.generateMessageResponse(
                                                                HttpStatus.INTERNAL_SERVER_ERROR,
                                                                "Error interno", false);
                                        });
                }

                Integer idTransferRequest = body.containsKey("id_transfer_request")
                                ? parseInteger(body.get("id_transfer_request"))
                                : null;
                Integer idType = body.containsKey("id_transfer_observation_type")
                                ? parseInteger(body.get("id_transfer_observation_type"))
                                : null;
                String detail = body.containsKey("detail_observation_transfer")
                                ? String.valueOf(body.get("detail_observation_transfer"))
                                : null;

                world.inclub.transfer.liquidation.api.dtos.TransferObservationRequest req = new world.inclub.transfer.liquidation.api.dtos.TransferObservationRequest();
                req.setIdTransferRequest(idTransferRequest);
                req.setIdTransferObservationType(idType);
                req.setDetailObservationTransfer(detail);

                return transferObservationService.createWithEnrichedTransfer(req)
                                .flatMap(data -> {
                                        // build payload same shape as rejection so consumers receive a unified format
                                        java.util.Map<String, Object> payload = new java.util.HashMap<>();
                                        java.util.Map<String, Object> bodyMap = new java.util.HashMap<>();

                                        // observation details
                                        java.util.Map<String, Object> observation = new java.util.HashMap<>();
                                        if (data instanceof java.util.Map) {
                                                java.util.Map<?, ?> dmap = (java.util.Map<?, ?>) data;
                                                Object obs = dmap.get("observation");
                                                if (obs instanceof java.util.Map) {
                                                        java.util.Map<?, ?> obsMap = (java.util.Map<?, ?>) obs;
                                                        for (java.util.Map.Entry<?, ?> e : obsMap.entrySet()) {
                                                                Object k = e.getKey();
                                                                if (k instanceof String) {
                                                                        observation.put((String) k, e.getValue());
                                                                }
                                                        }
                                                }
                                        }
                                        bodyMap.put("observation", observation);

                                        // include enriched transferRequest if present
                                        if (data instanceof java.util.Map) {
                                                java.util.Map<?, ?> dmap = (java.util.Map<?, ?>) data;
                                                Object tr = dmap.get("transferRequest");
                                                bodyMap.put("transferRequest",
                                                                tr != null ? tr : new java.util.HashMap<>());
                                        } else {
                                                bodyMap.put("transferRequest", new java.util.HashMap<>());
                                        }

                                        // extract transferRequestId if possible
                                        Integer[] transferRequestId = new Integer[1];
                                        if (data instanceof java.util.Map) {
                                                java.util.Map<?, ?> dmap = (java.util.Map<?, ?>) data;
                                                Object idObj = dmap.get("idTransferRequest");
                                                if (idObj == null && dmap
                                                                .get("transferRequest") instanceof java.util.Map) {
                                                        idObj = ((java.util.Map<?, ?>) dmap.get("transferRequest"))
                                                                        .get("idTransferRequest");
                                                }
                                                if (idObj instanceof Number)
                                                        transferRequestId[0] = ((Number) idObj).intValue();
                                                else if (idObj instanceof String) {
                                                        try {
                                                                transferRequestId[0] = Integer
                                                                                .valueOf(((String) idObj).trim());
                                                        } catch (Exception e) {
                                                        }
                                                }
                                        }

                                        bodyMap.put("transferRequestId",
                                                        transferRequestId[0] != null ? transferRequestId[0] : null);

                                        payload.put("subject", "Solicitud de transferencia observada");
                                        payload.put("body", bodyMap);
                                        Object recipient = null;
                                        if (data instanceof java.util.Map) {
                                                java.util.Map<?, ?> dmap = (java.util.Map<?, ?>) data;
                                                Object tr = dmap.get("transferRequest");
                                                if (tr instanceof java.util.Map) {
                                                        recipient = ((java.util.Map<?, ?>) tr)
                                                                        .get("user_to_correo_electronico");
                                                }
                                        }
                                        payload.put("recipientEmail",
                                                        recipient != null ? String.valueOf(recipient) : "");

                                        // The service now handles status update and sending Kafka messages (same as rejection flow).
                                        // We just return the enriched data as response.
                                        return ResponseHandler.generateResponse(HttpStatus.CREATED, Mono.just(data), true);
                                })
                                .onErrorResume(IllegalArgumentException.class, ex -> {
                                        log.warn("Bad request creating transfer observation: {}", ex.getMessage());
                                        return ResponseHandler.generateMessageResponse(HttpStatus.BAD_REQUEST,
                                                        ex.getMessage(), false);
                                }).onErrorResume(ex -> {
                                        log.error("Error inserting transfer_observation via service", ex);
                                        return ResponseHandler.generateMessageResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                                                        "Error interno al insertar observación", false);
                                });
        }

        @PostMapping(path = "/request/accept")
        public Mono<ResponseEntity<Object>> acceptTransfer(@RequestBody(required = false) Map<String, Object> body) {
                if (body == null || body.isEmpty()) {
                        return ResponseHandler.generateMessageResponse(HttpStatus.BAD_REQUEST,
                                        "body requerido con id_transfer_request o id", false);
                }

                Integer id = body.containsKey("id_transfer_request")
                                ? parseInteger(body.get("id_transfer_request"))
                                : (body.containsKey("id") ? parseInteger(body.get("id")) : null);

                if (id == null || id <= 0) {
                        return ResponseHandler.generateMessageResponse(HttpStatus.BAD_REQUEST,
                                        "id_transfer_request/id inválido", false);
                }

                return transferAcceptanceService.accept(id)
                                .flatMap(enriched -> ResponseHandler.generateResponse(HttpStatus.OK, Mono.just((Object) enriched), true))
                                .onErrorResume(IllegalArgumentException.class, ex -> {
                                        log.warn("Bad request accepting transfer: {}", ex.getMessage());
                                        return ResponseHandler.generateMessageResponse(HttpStatus.BAD_REQUEST, ex.getMessage(), false);
                                })
                                .onErrorResume(ex -> {
                                        log.error("Error aceptando TransferRequest id={} ", id, ex);
                                        String msg = ex.getMessage() != null ? ex.getMessage() : "";
                                        if (msg.contains("no encontrada")) {
                                                return ResponseHandler.generateMessageResponse(HttpStatus.NOT_FOUND,
                                                                "TransferRequest no encontrada", false);
                                        }
                                        return ResponseHandler.generateMessageResponse(
                                                        HttpStatus.INTERNAL_SERVER_ERROR,
                                                        "Error interno al aceptar transferencia", false);
                                });
        }

        @PostMapping("/list/request")
        public Mono<ResponseEntity<Object>> listOrUpdate(@RequestBody(required = false) Map<String, Object> body) {
                var flux = transferRequestService.getByStatusEnrichedSorted(1);
                return flux.collectList()
                        .flatMap(list -> {
                                // Always return 200 with the list (possibly empty)
                                if (list == null || list.isEmpty()) {
                                        return ResponseHandler.generateResponse(HttpStatus.OK,
                                                        Mono.just(List.of()), true);
                                }
                                return ResponseHandler.generateResponse(HttpStatus.OK, Mono.just(list), true);
                        })
                        .onErrorResume(ex -> {
                                // In case of any error upstream, log and return an empty list with 200
                                log.warn("Error obteniendo TransferRequest(s) — devolviendo lista vacía", ex);
                                return ResponseHandler.generateResponse(HttpStatus.OK, Mono.just(List.of()), true);
                        });
        }

        private Map<String, Object> defaultSponsorMap(world.inclub.transfer.liquidation.domain.entity.Account account) {
                Map<String, Object> map = new HashMap<>();
                map.put("sponsor_id", account.getId());
                map.put("sponsor_username", account.getUsername());
                map.put("sponsor_name", account.getName());
                map.put("sponsor_last_name", account.getLastName());
                map.put("id_state", null);
                return map;
        }

        private static boolean isBlank(String s) {
                return s == null || s.trim().isEmpty();
        }

        private static Integer parseInteger(Object value) {
                if (value == null)
                        return null;
                if (value instanceof Number)
                        return ((Number) value).intValue();
                if (value instanceof String) {
                        try {
                                return Integer.valueOf(((String) value).trim());
                        } catch (NumberFormatException e) {
                                return null;
                        }
                }
                return null;
        }

        @GetMapping("/payment-log")
        public Mono<ResponseEntity<Object>> listPaymentLogs(@RequestParam("idsuscription") Integer idsuscription) {
                if (idsuscription == null || idsuscription <= 0) {
                        return ResponseHandler.generateMessageResponse(HttpStatus.BAD_REQUEST, "idsuscription inválido",
                                        false);
                }
                return ResponseHandler.generateResponse(HttpStatus.OK,
                                paymentLogService.listBySubscription(idsuscription).collectList()
                                                .map(Object.class::cast),
                                true)
                                .onErrorResume(ex -> {
                                        log.error("Error listando payment_log por idsuscription {}", idsuscription, ex);
                                        return ResponseHandler.generateMessageResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                                                        "Error interno", false);
                                });
        }

        @PostMapping("/payment-log/snapshot")
        public Mono<ResponseEntity<Object>> snapshotPaymentLogs(@RequestBody Map<String, Object> body) {
                if (body == null || body.isEmpty()) {
                        return ResponseHandler.generateMessageResponse(HttpStatus.BAD_REQUEST, "body requerido", false);
                }

                Integer idsuscription = parseInteger(body.get("idsuscription"));
                Integer idpayment = parseInteger(body.get("idpayment"));

                if (idpayment != null && idpayment > 0) {
                        return ResponseHandler.generateResponse(HttpStatus.CREATED,
                                        paymentLogService.snapshotOne(idpayment).map(Object.class::cast), true)
                                        .onErrorResume(ex -> {
                                                log.error("Error generando snapshot de payment {}", idpayment, ex);
                                                return ResponseHandler.generateMessageResponse(
                                                                HttpStatus.INTERNAL_SERVER_ERROR, "Error interno",
                                                                false);
                                        });
                }

                if (idsuscription == null || idsuscription <= 0) {
                        return ResponseHandler.generateMessageResponse(HttpStatus.BAD_REQUEST,
                                        "idsuscription inválido o idpayment requerido", false);
                }

                return ResponseHandler.generateResponse(HttpStatus.CREATED,
                                paymentLogService.snapshotAll(idsuscription).collectList().map(Object.class::cast),
                                true)
                                .onErrorResume(ex -> {
                                        log.error("Error generando snapshot total para idsuscription {}", idsuscription,
                                                        ex);
                                        return ResponseHandler.generateMessageResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                                                        "Error interno", false);
                                });
        }
}
