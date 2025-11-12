package world.inclub.transfer.liquidation.infraestructure.kafka.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.api.dtos.StateTransferDTO;
import world.inclub.transfer.liquidation.application.service.interfaces.ITransferService;
// import world.inclub.transfer.liquidation.domain.entity.Transfer;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaRequestReplyTransferService {

    private final ITransferService iTransferService;

    // private final KafkaTemplate<String, Object> kafkaTemplate;

    @KafkaListener(topics = "topic-state-transfer", groupId = "statetransfer-group-100", containerFactory = "createTransferKafkaListenerContainerFactory")
    public void consume(StateTransferDTO request) {
    	
        log.info("Consumer transfer: {}", request);
        iTransferService.updateIdStatusById(request).flatMap(response -> {
            log.info("Transfer update: {}", response);
            return Mono.just("");
        }).subscribe(
                response -> log.info("Transfer sent: {}", response),
                error -> log.error("Error: {}", error.getMessage())
        );
       
    }

}
