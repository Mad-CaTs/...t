package world.inclub.appnotification.emailMassive.application.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.appnotification.domain.port.IEmailPort;
import world.inclub.appnotification.domain.port.INotificationSubscriptionDelayPort;

import world.inclub.appnotification.emailMassive.application.service.emailmassiveService;
import world.inclub.appnotification.shared.infrastructure.utils.EmailTemplateLoader;


import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

@Slf4j
@Service
@RequiredArgsConstructor
public class emailmassiveServiceImpl implements emailmassiveService {

    private final IEmailPort emailPort;
    private final INotificationSubscriptionDelayPort repository;


    @Override
    public Flux<Boolean> findAllEmailAndSend() {
        String subject = "✨ Queremos seguir creciendo contigo ✨";
        String templateFile = "templates/email_support_satisfaction_masive.html";

        String body;
        try {
            body = loadTemplate(templateFile);
        } catch (IOException e) {
            log.error("No se pudo cargar la plantilla: {}", e.getMessage());
            return Flux.error(e);
        }

        return repository.finduserEmail()
                .flatMap(userEmail -> {
                    try {
                        emailPort.sendEmail(userEmail.email(), subject, body, null);
                        log.info("Email enviado a {}", userEmail.email());
                        return Mono.just(true);
                    } catch (Exception e) {
                        log.error("Error enviando email a {}: {}", userEmail.email(), e.getMessage());
                        return Mono.just(false);
                    }
                });
    }

    private String loadTemplate(String fileName) throws IOException {
        return EmailTemplateLoader.loadTemplate(fileName);


    }

    }
