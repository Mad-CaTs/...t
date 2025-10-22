package world.inclub.membershippayment.infraestructure.listeners;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import world.inclub.membershippayment.domain.dto.UserStateDto;
import world.inclub.membershippayment.infraestructure.config.kafka.constants.KafkaConstants;

@Service
public class KafkaConsumerUserStateService {
    @KafkaListener(topics = "topic-state-account", groupId = KafkaConstants.GROUP_ID, containerFactory = "userStateDtoKafkaListenerContainerFactory")
    public void consume(UserStateDto userStateDto ) {
        System.out.println("Consumed message: " + userStateDto);
    }
}
