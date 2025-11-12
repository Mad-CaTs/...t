package world.inclub.transfer.liquidation.infraestructure.kafka.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.api.dtos.StateLiquidationDTO;
import world.inclub.transfer.liquidation.application.service.interfaces.ILiquidationService;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaRequestReplyLiquidationService {

    private final ILiquidationService iLiquidationService;

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @KafkaListener(topics = "topic-state-liquidation", groupId = "stateliquidation-group-100", containerFactory = "createLiquidationKafkaListenerContainerFactory")
    public void consume(StateLiquidationDTO request) {
    	
        log.info("Consumer liquidation: {}", request);
        iLiquidationService.updateIdStatusById(request).flatMap(response -> {
            log.info("Liquidation update: {}", response);
            return Mono.just("");
        }).subscribe(
                response -> log.info("liquidation sent: {}", response),
                error -> log.error("Error: {}", error.getMessage())
        );
       
    }

}
