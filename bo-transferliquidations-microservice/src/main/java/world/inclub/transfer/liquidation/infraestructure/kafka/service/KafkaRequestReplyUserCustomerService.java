package world.inclub.transfer.liquidation.infraestructure.kafka.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.api.dtos.StateTransferDTO;
import world.inclub.transfer.liquidation.api.dtos.UserAccountDto;
import world.inclub.transfer.liquidation.application.service.interfaces.ITransferService;
import world.inclub.transfer.liquidation.application.service.interfaces.IUserCustomerService;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaRequestReplyUserCustomerService {

    private final IUserCustomerService iUserCustomerService;

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @KafkaListener(topics = "topic-account-backup", groupId = "topicaccount-group-100", containerFactory = "createUserCustomerKafkaListenerContainerFactory")
    public void consume(UserAccountDto request) {
    	
        log.info("Consumer account: {}", request);
        iUserCustomerService.saveUserCustomer(request).flatMap(response -> {
            log.info("Account save: {}", response);
            return Mono.just("");
        }).subscribe(
                response -> log.info("Account sent: {}", response),
                error -> log.error("Error: {}", error.getMessage())
        );
       
    }

}
