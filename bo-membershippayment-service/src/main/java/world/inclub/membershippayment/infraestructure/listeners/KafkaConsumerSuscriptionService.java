package world.inclub.membershippayment.infraestructure.listeners;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import world.inclub.membershippayment.aplication.dao.SuscriptionDao;
import world.inclub.membershippayment.aplication.service.SubscriptionDelayService;
import world.inclub.membershippayment.domain.dto.request.SubscriptionDelayRequest;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.StateSuscriptionDto;
import world.inclub.membershippayment.domain.dto.SuscriptionDTO;
import world.inclub.membershippayment.infraestructure.config.kafka.constants.KafkaConstants;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaConsumerSuscriptionService {

    private final SuscriptionDao suscriptionDao;

    private final SubscriptionDelayService subscriptionDelayService;


    @KafkaListener(topics = "topic-test-suscription", groupId = KafkaConstants.GROUP_ID, containerFactory = "suscriptionKafkaListenerContainerFactory")
    public void consume(SuscriptionDTO suscription) {
        long id = suscription.getIdSuscription();
        suscriptionDao.getSuscriptionById(id)
                .flatMap(existingSuscription -> {
                    // Si la suscripción ya existe en la base de datos, actualiza los datos

                    existingSuscription.setIdUser(suscription.getIdUser());
                    existingSuscription.setCreationDate(suscription.getCreationDate());
                    existingSuscription.setStatus(suscription.getStatus());
                    existingSuscription.setModificationDate(suscription.getModificationDate());
                    existingSuscription.setIsMigrated(suscription.getBoolmigration());
                    existingSuscription.setIdPackageDetail(suscription.getPackageDetailId());
                    existingSuscription.setIdPackage(suscription.getIdPackage());
                    return suscriptionDao.postSuscription(existingSuscription);
                })
                // Si la suscripción no existe en la base de
                // datos, la guarda
                .subscribe(null, error -> {
                    // Maneja la excepción aquí
                    System.err.println("Error: " + error.getMessage());
                });
    }

    @KafkaListener(topics = "topic-state-suscription", groupId = KafkaConstants.GROUP_ID, containerFactory =  "stateSuscriptionDtoKafkaListenerContainerFactory")
    public void consumeStates(StateSuscriptionDto stateRequest) {
        long id = stateRequest.getIdSuscription();
        Integer status = stateRequest.getIdState();
        suscriptionDao.putSuscription(id, status)
                .subscribe(null, error -> {});

    }

    @KafkaListener(topics = "topic-subscription-payment-delay", groupId = KafkaConstants.GROUP_ID, containerFactory = "subscriptionDelayRequestKafkaListenerContainerFactory")
    public void consumePaymentDelay(SubscriptionDelayRequest request) {
        subscriptionDelayService.calculateAndSavePaymentDelay(request)
                .subscribe(null, error -> {
                    System.err.println("Error: " + error.getMessage());
                });
    }

}

