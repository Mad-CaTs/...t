package world.inclub.appnotification.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.appnotification.domain.dto.SubscriptionDelayDTO;
import world.inclub.appnotification.emailMassive.application.dto.UserEmailDTO;
import world.inclub.appnotification.infraestructure.entity.NotificationSubscriptionDelay;

import java.time.LocalDateTime;

public interface INotificationSubscriptionDelayPort {
    Mono<NotificationSubscriptionDelay> save(NotificationSubscriptionDelay notificationSubscriptionDelay);

    Flux<SubscriptionDelayDTO> findDelayDaysByAllSubscriptions();

    Mono<LocalDateTime> findNextExpirationDateByIdSubscription(Long idSuscription);

    Mono<Boolean> existsByIdSubscriptionAndTotalDays(Long idSubscription, Integer totalDays);

    Flux<UserEmailDTO> finduserEmail();
}
