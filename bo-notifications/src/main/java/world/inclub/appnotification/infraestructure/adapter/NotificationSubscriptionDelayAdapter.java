package world.inclub.appnotification.infraestructure.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.appnotification.domain.dto.SubscriptionDelayDTO;
import world.inclub.appnotification.domain.port.INotificationSubscriptionDelayPort;
import world.inclub.appnotification.emailMassive.application.dto.UserEmailDTO;
import world.inclub.appnotification.infraestructure.entity.NotificationSubscriptionDelay;

import java.time.LocalDateTime;

@Repository
@RequiredArgsConstructor
public class NotificationSubscriptionDelayAdapter implements INotificationSubscriptionDelayPort {

    private final INotificationSubscriptionDelayAdapter notificationSubscriptionDelayRepository;

    @Override
    public Mono<NotificationSubscriptionDelay> save(NotificationSubscriptionDelay notificationSubscriptionDelay) {
        return notificationSubscriptionDelayRepository.save(notificationSubscriptionDelay);
    }

    @Override
    public Flux<SubscriptionDelayDTO> findDelayDaysByAllSubscriptions() {
        return notificationSubscriptionDelayRepository.findDelayDaysByAllSubscriptions();
    }

    @Override
    public Mono<LocalDateTime> findNextExpirationDateByIdSubscription(Long idSubscription) {
        return notificationSubscriptionDelayRepository.findNextExpirationDateByIdSubscription(idSubscription);
    }

    @Override
    public Mono<Boolean> existsByIdSubscriptionAndTotalDays(Long idSubscription, Integer totalDays) {
        return notificationSubscriptionDelayRepository.existsByIdSubscriptionAndTotalDays(idSubscription, totalDays);
    }

    @Override
    public Flux<UserEmailDTO> finduserEmail() {
        return notificationSubscriptionDelayRepository.findAllEmail();
    }

}
