package world.inclub.transfer.liquidation.application.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.slf4j.LoggerFactory;
import world.inclub.transfer.liquidation.infraestructure.config.kafka.producer.KafkaProducer;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.api.dtos.TransferObservationRequest;
import world.inclub.transfer.liquidation.application.service.interfaces.ITransferObservationService;
import world.inclub.transfer.liquidation.application.service.interfaces.ITransferRequestService;
import world.inclub.transfer.liquidation.domain.entity.TransferObservation;
import world.inclub.transfer.liquidation.domain.port.ITransferObservationPort;
import world.inclub.transfer.liquidation.domain.port.ITransferObservationTypePort;
import world.inclub.transfer.liquidation.domain.enums.TransferStatus;

@Service
@RequiredArgsConstructor
public class TransferObservationServiceImpl implements ITransferObservationService {

    private final ITransferObservationPort transferObservationPort;
    private final ITransferObservationTypePort transferObservationTypePort;
    private final ITransferRequestService transferRequestService;
    private final KafkaProducer kafkaProducer;

    @Override
    public Flux<TransferObservation> listTypes() {
        return transferObservationTypePort.getAll().map(t -> {
            TransferObservation o = new TransferObservation();
            o.setIdTransferObservationType(t.getId().intValue());
            o.setDetailObservationTransfer(t.getName());
            return o;
        });
    }

    @Override
    public Mono<TransferObservation> create(TransferObservationRequest request) {
        if (request == null) return Mono.error(new IllegalArgumentException("request es requerido"));

        Integer idReq = request.getIdTransferRequest();
        Integer idType = request.getIdTransferObservationType();

        if (idReq == null || idType == null) {
            return Mono.error(new IllegalArgumentException("id_transfer_request y id_transfer_observation_type son requeridos para insertar"));
        }

        if (idReq <= 0 || idType <= 0) {
            return Mono.error(new IllegalArgumentException("id_transfer_request e id_transfer_observation_type deben ser enteros positivos"));
        }

        TransferObservation o = new TransferObservation();
        o.setIdTransferRequest(idReq);
        o.setIdTransferObservationType(idType);
        o.setDetailObservationTransfer(request.getDetailObservationTransfer());

        return transferObservationPort.insert(o)
            .flatMap(saved -> transferRequestService
                .updateStatus(idReq, TransferStatus.OBSERVED.getValue())
                .then(
                    transferRequestService.getByIdEnriched(idReq)
                        .defaultIfEmpty(new java.util.HashMap<>())
                        .flatMap(enriched -> {
                            try {
                                java.util.Map<String, Object> payload = new java.util.HashMap<>();
                                java.util.Map<String, Object> body = new java.util.HashMap<>();
                                java.util.Map<String, Object> observation = new java.util.HashMap<>();
                                observation.put("id", saved.getId());
                                observation.put("idTransferRequest", saved.getIdTransferRequest());
                                observation.put("idTransferObservationType", saved.getIdTransferObservationType());
                                observation.put("detailObservationTransfer", saved.getDetailObservationTransfer());
                                observation.put("observedTransferAt", saved.getObservedTransferAt());
                                body.put("observation", observation);
                                body.put("transferRequest", enriched);
                                body.put("transferRequestId", idReq);

                                payload.put("subject", "Solicitud de transferencia observada");
                                payload.put("body", body);
                                Object recipient = enriched.get("user_to_correo_electronico");
                                payload.put("recipientEmail", recipient != null ? String.valueOf(recipient) : "");

                                kafkaProducer.sendEmailMessage("transfer-request-email", payload);
                            } catch (Exception ex) {
                                LoggerFactory.getLogger(TransferObservationServiceImpl.class)
                                    .error("Error building/sending observation email for transfer {}", idReq, ex);
                            }
                            return Mono.just(saved);
                        })
                )
            );
    }

    @Override
    public reactor.core.publisher.Mono<java.util.Map<String, Object>> createWithEnrichedTransfer(TransferObservationRequest request) {
        return create(request).flatMap(saved ->
            transferRequestService.getByIdEnriched(saved.getIdTransferRequest())
                .map(enriched -> {
                    java.util.Map<String, Object> observation = new java.util.HashMap<>();
                    observation.put("id", saved.getId());
                    observation.put("idTransferRequest", saved.getIdTransferRequest());
                    observation.put("idTransferObservationType", saved.getIdTransferObservationType());
                    observation.put("detailObservationTransfer", saved.getDetailObservationTransfer());
                    observation.put("observedTransferAt", saved.getObservedTransferAt());

                    java.util.Map<String, Object> combined = new java.util.HashMap<>();
                    combined.put("observation", observation);
                    combined.put("transferRequest", enriched);
                    return combined;
                })
        );
    }
}
