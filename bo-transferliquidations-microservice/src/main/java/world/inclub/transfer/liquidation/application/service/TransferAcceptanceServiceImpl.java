package world.inclub.transfer.liquidation.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.application.service.interfaces.ITransferAcceptanceService;
import world.inclub.transfer.liquidation.application.service.interfaces.ITransferRequestService;
import world.inclub.transfer.liquidation.domain.enums.TransferStatus;
import world.inclub.transfer.liquidation.infraestructure.config.kafka.producer.KafkaProducer;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransferAcceptanceServiceImpl implements ITransferAcceptanceService {

    private final ITransferRequestService transferRequestService;
    private final KafkaProducer kafkaProducer;

    @Override
    public Mono<java.util.Map<String, Object>> accept(Integer id) {
        if (id == null || id <= 0) return Mono.error(new IllegalArgumentException("id inválido"));

        ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules()
                .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        return transferRequestService.updateStatus(id, TransferStatus.ACCEPTED.getValue())
                .then(transferRequestService.getByIdEnriched(id)
                        .defaultIfEmpty(new java.util.HashMap<>())
                        .flatMap(enriched -> {
                            try {
                                java.util.Map<String, Object> payload = new java.util.HashMap<>();
                                java.util.Map<String, Object> emailBody = new java.util.HashMap<>();
                                java.util.Map<String, Object> acceptance = new java.util.HashMap<>();
                                acceptance.put("idTransferRequest", id);
                                acceptance.put("acceptedAt", java.time.Instant.now());
                                emailBody.put("acceptance", acceptance);
                                emailBody.put("transferRequest", enriched);
                                emailBody.put("transferRequestId", id);

                                payload.put("subject", "Solicitud de transferencia aceptada");
                                payload.put("body", emailBody);
                                Object recipient = enriched.get("user_to_correo_electronico");
                                payload.put("recipientEmail", recipient != null ? String.valueOf(recipient) : "");

                                try {
                                    String json = objectMapper.writeValueAsString(payload);
                                    log.info("TransferAcceptanceService: built accept payload for id {}: {}", id, json);
                                } catch (Exception se) {
                                    log.warn("TransferAcceptanceService: could not serialize accept payload for id {}", id, se);
                                }

                                log.info("TransferAcceptanceService: sending accept payload to topic transfer-request-email for id {}", id);
                                kafkaProducer.sendEmailMessage("transfer-request-email", payload);

                                // Also send wrapper JSON (same shape as observation) to transfer-observation topic
                                try {
                                    java.util.Map<String, Object> wrapper = new java.util.LinkedHashMap<>();
                                    wrapper.put("result", true);
                                    wrapper.put("data", enriched);
                                    wrapper.put("timestamp", java.time.Instant.now().toString());
                                    wrapper.put("status", HttpStatus.OK.value());

                                    String wrapperJson = objectMapper.writeValueAsString(wrapper);
                                    log.info("TransferAcceptanceService: sending wrapper JSON to topic transfer-request-accept for id {}: {}", id, wrapperJson);
                                    kafkaProducer.sendMessage("transfer-request-accept", wrapperJson, String.valueOf(id));
                                } catch (Exception wex) {
                                    log.error("TransferAcceptanceService: error building/sending wrapper JSON for accept id {}", id, wex);
                                }
                            } catch (Exception ex) {
                                log.error("Error building/sending accept email for transfer {}", id, ex);
                            }
                            return Mono.just(enriched);
                        }));
    }
}
