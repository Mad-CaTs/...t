package world.inclub.membershippayment.infraestructure.listeners;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import world.inclub.membershippayment.domain.dto.request.UserDTO;
import world.inclub.membershippayment.infraestructure.config.kafka.constants.KafkaConstants;

@Service
public class KafkaConsumerUserService {
    @KafkaListener(topics = "topic-user", groupId = KafkaConstants.GROUP_ID, containerFactory = "userKafkaListenerContainerFactory")
    public void consume(UserDTO user) {
        System.out.println("Consumed message: " + user);
    }
}
