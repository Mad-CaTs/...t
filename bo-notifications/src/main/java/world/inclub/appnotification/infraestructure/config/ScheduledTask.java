package world.inclub.appnotification.infraestructure.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import freemarker.template.TemplateException;
import reactor.core.publisher.Mono;
import world.inclub.appnotification.application.usecases.IEmailService;
import world.inclub.appnotification.infraestructure.adapter.NotificationSubscriptionDelayAdapter;

import javax.mail.MessagingException;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Objects;

@Component
@RequiredArgsConstructor
@Slf4j
public class ScheduledTask {

    private final IEmailService emailService;

    private final NotificationSubscriptionDelayAdapter notificationSubscriptionDelayAdapter;

    @Scheduled(cron="0 0 6 * * ?", zone = "America/Lima")
    public void scheduledNotification() {
        notificationSubscriptionDelayAdapter.findDelayDaysByAllSubscriptions()
                .switchIfEmpty(Mono.error(new RuntimeException("No hay suscripciones con días de retraso validos")))
                .flatMap(response -> {
                    return notificationSubscriptionDelayAdapter.findNextExpirationDateByIdSubscription(response.getIdSubscription())
                            .filter(Objects::nonNull)
                            .switchIfEmpty(Mono.error(new RuntimeException("No hay fecha de expiración válida para la suscripción con ID: " + response.getIdSubscription())))
                            .flatMap(expirationDate -> {
                                // Obtenemos la fecha actual en la zona horaria de Lima
                                ZoneId limaZone = ZoneId.of("America/Lima");
                                LocalDateTime now = LocalDateTime.now(limaZone);

                                long daysBetween = ChronoUnit.DAYS.between(now, expirationDate);
                                int delayDays = response.getTotalDays();

                                // Si la de ahora es después de la fecha de expiración, sumamos los días de
                                // retraso
                                if (now.isAfter(expirationDate)) {
                                    delayDays += Math.abs((int) daysBetween);
                                    response.setTotalDays(delayDays);
                                }
                                log.info("DIAS CONTADOS: {}", delayDays);

                                try {
                                    return emailService.sendEmailToAnnualLiquidation(response, now);
                                } catch (MessagingException | TemplateException | IOException e) {
                                    return Mono.error(new RuntimeException("Error sending notification: " + e.getMessage()));
                                }

                            })
                            .doOnError(error -> log.error("Error al enviar la notificación: {}", error.getMessage()))
                            .onErrorResume(error -> Mono.empty());
                })
                .doOnError(error -> log.warn("Error al ejecutar tarea programada: {}", error.getMessage()))
                .onErrorResume(error -> Mono.empty())
                .doOnTerminate(() -> log.info("Envío de notificación programada completado a las: {}",
                        LocalDateTime.now(ZoneId.of("America/Lima"))
                                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))))
                .subscribe();
    }

}
