package world.inclub.appnotification.application.usecases;

import freemarker.template.TemplateException;
import reactor.core.publisher.Mono;
import world.inclub.appnotification.domain.dto.SubscriptionDelayDTO;
import world.inclub.appnotification.domain.dto.request.EmailRequestDTO;

import javax.mail.MessagingException;
import java.io.IOException;
import java.time.LocalDateTime;

public interface IEmailService {

    void SendEmail( EmailRequestDTO email) throws MessagingException, IOException, TemplateException;
    void sendMails(EmailRequestDTO requestDTO) throws MessagingException, IOException, TemplateException;
    Mono<Void> sendEmailToAnnualLiquidation(SubscriptionDelayDTO response, LocalDateTime date) throws MessagingException, TemplateException, IOException;

}
