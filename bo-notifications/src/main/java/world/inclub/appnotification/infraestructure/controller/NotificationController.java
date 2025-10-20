package world.inclub.appnotification.infraestructure.controller;

import freemarker.template.TemplateException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.appnotification.application.usecases.IEmailService;
import world.inclub.appnotification.application.usecases.INotificationService;
import world.inclub.appnotification.domain.constant.NotificationConstant;
import world.inclub.appnotification.domain.dto.request.EmailRequestDTO;
import world.inclub.appnotification.emailMassive.application.service.emailmassiveService;
import world.inclub.appnotification.infraestructure.config.ScheduledTask;
import world.inclub.appnotification.infraestructure.handler.ResponseHandler;

import javax.mail.MessagingException;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping(NotificationConstant.API_BASE_PATH + NotificationConstant.NAME_SERVICE_ACCOUNT)
public class NotificationController {

    private final IEmailService emailService;

    private final INotificationService iNotificationService;

    private final ScheduledTask scheduledTask;

    private final emailmassiveService  _emailmassiveService;

    @PostMapping("/send-email")
    public Mono<ResponseEntity<Object>> sendEmailUsser(@Valid @RequestBody EmailRequestDTO input)
            throws MessagingException, IOException, TemplateException {
                
        emailService.SendEmail(input);
        return ResponseHandler.generateMonoResponse(HttpStatus.CREATED,
                iNotificationService.saveNotificationUser(input.getUser().getEmail())
                        .map(Object.class::cast),
                true);
    }

    @PostMapping("/send-mails")
    public Mono<ResponseEntity<Object>> sendMails(@Valid @RequestBody EmailRequestDTO input)
            throws MessagingException, IOException, TemplateException {

        emailService.sendMails(input);
        return ResponseHandler.generateMonoResponse(HttpStatus.CREATED,
                iNotificationService.saveNotification(input.getUser().getEmail())
                        .map(Object.class::cast),
                true);
    }

    // Esto endpoint solo es para pruebas, pero puede ser usada si es que por algún caso falla
    @PostMapping("/send-annual-mails")
    public Mono<ResponseEntity<Object>> sendAnnualMails() {
        scheduledTask.scheduledNotification();
        return ResponseHandler.generateMonoResponse(HttpStatus.ACCEPTED,
                Mono.just(Map.of("message", "Se han enviado los correos de notificación de liquidación anual")),
                true);
    }

    @PostMapping("/send-massive")
    public ResponseEntity<Flux<Boolean>> sendMassiveEmails() {
        Flux<Boolean> result = _emailmassiveService.findAllEmailAndSend();
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(result);
    }

}
