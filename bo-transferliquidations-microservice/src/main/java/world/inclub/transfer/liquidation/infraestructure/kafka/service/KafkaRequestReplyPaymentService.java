package world.inclub.transfer.liquidation.infraestructure.kafka.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.api.dtos.PaymentDto;
import world.inclub.transfer.liquidation.api.dtos.StateTransferDTO;
import world.inclub.transfer.liquidation.application.service.interfaces.IPaymentService;
import world.inclub.transfer.liquidation.application.service.interfaces.ITransferService;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaRequestReplyPaymentService {

    private final IPaymentService iPaymentService;

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final world.inclub.transfer.liquidation.application.service.PaymentLogService paymentLogService;

    @KafkaListener(topics = "topic-payment-backup", groupId = "topicpayment-group-100", containerFactory = "createPaymentKafkaListenerContainerFactory")
    public void consume(PaymentDto request) {
    	
        log.info("Consumer payment: {}", request);

        iPaymentService.savePayment(request)
                .flatMap(response -> {
                    log.info("payment save: {}", response);
                    if (response == null || response.getIdPayment() == null) {
                        return Mono.just("no-id");
                    }
                    // chain snapshot reactively: snapshotOne returns Mono<PaymentLog>
                    return paymentLogService.snapshotOne(response.getIdPayment())
                            .doOnSuccess(pl -> log.info("Snapshot created for payment id: {} -> payment_log id: {}", response.getIdPayment(), pl != null ? pl.getIdPayment() : null))
                            .doOnError(err -> log.error("Error creating snapshot for payment id {}: {}", response.getIdPayment(), err.getMessage()))
                            .then(Mono.just("ok"));
                })
                .subscribe(
                        response -> log.info("Payment flow finished: {}", response),
                        error -> log.error("Error in payment consumer flow: {}", error, error)
                );
       
    }

}
