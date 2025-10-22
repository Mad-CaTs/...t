package world.inclub.membershippayment.infraestructure.listeners;


import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import world.inclub.membershippayment.domain.dto.response.AffiliateDTO;
import world.inclub.membershippayment.infraestructure.config.kafka.constants.KafkaConstants;


@Service
public class KafkaConsumerAffiliateService {


    @KafkaListener(
            topics = KafkaConstants.Topic.CREATE_AFFILIATE,
            groupId = KafkaConstants.GROUP_ID,
            containerFactory = "affiliateKafkaListenerContainerFactory"
    )
    public void consume(AffiliateDTO affiliateDTO ) {
        System.out.println("Consumed message: " + affiliateDTO);
    }
}
