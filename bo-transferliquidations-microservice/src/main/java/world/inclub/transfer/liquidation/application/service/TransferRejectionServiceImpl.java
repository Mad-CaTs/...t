package world.inclub.transfer.liquidation.application.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.api.dtos.TransferRejectionRequest;
import world.inclub.transfer.liquidation.application.service.interfaces.ITransferRejectionService;
import world.inclub.transfer.liquidation.domain.entity.TransferRejection;
import world.inclub.transfer.liquidation.domain.port.ITransferRejectionPort;
import world.inclub.transfer.liquidation.domain.port.ITransferRejectionTypePort;
import world.inclub.transfer.liquidation.infraestructure.config.kafka.producer.KafkaProducer;
import world.inclub.transfer.liquidation.application.service.interfaces.ITransferRequestService;
import world.inclub.transfer.liquidation.domain.enums.TransferStatus;

@Service
@RequiredArgsConstructor
public class TransferRejectionServiceImpl implements ITransferRejectionService {

    private final ITransferRejectionPort transferRejectionPort;
    private final ITransferRejectionTypePort transferRejectionTypePort;
    private final KafkaProducer kafkaProducer;
    private final ITransferRequestService transferRequestService;

    @Override
    public Flux<TransferRejection> listTypes() {
        return transferRejectionTypePort.getAll().map(t -> {
            TransferRejection r = new TransferRejection();
            r.setIdTransferRejectionType(t.getId().intValue());
            r.setDetailRejectionTransfer(t.getName());
            return r;
        });
    }

    @Override
    public Mono<TransferRejection> create(TransferRejectionRequest request) {
        if (request == null) {
            return Mono.error(new IllegalArgumentException("request es requerido"));
        }

        Integer idReq = request.getIdTransferRequest();
        Integer idType = request.getIdTransferRejectionType();

        if (idReq == null || idType == null) {
            return Mono.error(new IllegalArgumentException(
                    "id_transfer_request y id_transfer_rejection_type son requeridos para insertar"));
        }

        if (idReq <= 0 || idType <= 0) {
            return Mono.error(new IllegalArgumentException(
                    "id_transfer_request e id_transfer_rejection_type deben ser enteros positivos"));
        }

        TransferRejection r = new TransferRejection();
        r.setIdTransferRequest(idReq);
        r.setIdTransferRejectionType(idType);
        r.setDetailRejectionTransfer(request.getDetailRejectionTransfer());

        return transferRejectionPort.insert(r)
                .flatMap(savedRejection -> transferRequestService
                        .updateStatus(idReq, TransferStatus.REJECTED.getValue())
                        .then(
                                transferRequestService.getByIdEnriched(idReq)
                                        .defaultIfEmpty(new java.util.HashMap<>())
                                        .flatMap(enriched -> {
                                            try {
                                                java.util.Map<String, Object> payload = new java.util.HashMap<>();
                                                java.util.Map<String, Object> body = new java.util.HashMap<>();
                                                java.util.Map<String, Object> rejection = new java.util.HashMap<>();
                                                rejection.put("id", savedRejection.getId());
                                                rejection.put("idTransferRequest",
                                                        savedRejection.getIdTransferRequest());
                                                rejection.put("idTransferRejectionType",
                                                        savedRejection.getIdTransferRejectionType());
                                                rejection.put("detailRejectionTransfer",
                                                        savedRejection.getDetailRejectionTransfer());
                                                rejection.put("rejectedTransferAt",
                                                        savedRejection.getRejectedTransferAt());
                                                body.put("rejection", rejection);
                                                body.put("transferRequest", enriched);
                                                body.put("transferRequestId", idReq);

                                                payload.put("subject", "Solicitud de transferencia rechazada");
                                                payload.put("body", body);
                                                Object recipient = enriched.get("user_to_correo_electronico");
                                                payload.put("recipientEmail",
                                                        recipient != null ? String.valueOf(recipient) : "");

                                                kafkaProducer.sendEmailMessage("transfer-request-email", payload);
                                            } catch (Exception ex) {
                                                org.slf4j.LoggerFactory.getLogger(TransferRejectionServiceImpl.class)
                                                        .error("Error building/sending rejection email for transfer {}",
                                                                idReq, ex);
                                            }
                                            return Mono.just(savedRejection);
                                        })));
    }
}