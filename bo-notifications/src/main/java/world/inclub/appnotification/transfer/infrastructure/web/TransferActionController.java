package world.inclub.appnotification.transfer.infrastructure.web;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import world.inclub.appnotification.transfer.infrastructure.kafka.producer.TransferKafkaProducer;


@RestController
@Slf4j
@RequestMapping("/transfer")
@RequiredArgsConstructor
public class TransferActionController {

    private final TransferKafkaProducer transferKafkaProducer;

    @GetMapping(value = "/{id}/accept", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> accept(
            @PathVariable("id") Long id,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "user_to_nombre", required = false) String userToNombre,
            @RequestParam(value = "user_to_apellido", required = false) String userToApellido,
            @RequestParam(value = "sponsor_nombre", required = false) String sponsorNombre,
            @RequestParam(value = "sponsor_last_name", required = false) String sponsorLastName
    ) {
    log.info("[HTTP-ACTION] accept clicked id={} email={} user_to_nombre={} user_to_apellido={}", id, email, userToNombre, userToApellido);
    transferKafkaProducer.publishAccepted(id, email, userToNombre, userToApellido);

        String body = "<html><body style='font-family:Arial,Helvetica,sans-serif;padding:24px;'><div style='max-width:640px;margin:0 auto;background:#ffffff;border-radius:8px;padding:24px;text-align:center;'><h2>Confirmado</h2><p>La acción ha sido registrada y la notificación se enviará en breve.</p></div><script>setTimeout(function(){try{window.close();}catch(e){}</script></body></html>";
        return ResponseEntity.ok().contentType(MediaType.TEXT_HTML).body(body);
    }

    @GetMapping(value = "/{id}/reject", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> reject(
            @PathVariable("id") Long id,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "user_to_nombre", required = false) String userToNombre,
            @RequestParam(value = "user_to_apellido", required = false) String userToApellido,
            @RequestParam(value = "user_from_email", required = false) String userFromEmail,
            @RequestParam(value = "user_from_nombre", required = false) String userFromNombre,
            @RequestParam(value = "user_from_apellido", required = false) String userFromApellido
    ) {
    log.info("[HTTP-ACTION] reject clicked id={} email={} user_to_nombre={} user_to_apellido={} user_from_email={} user_from_nombre={} user_from_apellido={}", id, email, userToNombre, userToApellido, userFromEmail, userFromNombre, userFromApellido);
    transferKafkaProducer.publishRejected(id, email, userToNombre, userToApellido, userFromEmail, userFromNombre, userFromApellido);
        String body = "<html><body style='font-family:Arial,Helvetica,sans-serif;padding:24px;'><div style='max-width:640px;margin:0 auto;background:#ffffff;border-radius:8px;padding:24px;text-align:center;'><h2>Rechazo registrado</h2><p>La acción ha sido registrada y la notificación de rechazo se enviará.</p></div><script>setTimeout(function(){try{window.close();}catch(e){}</script></body></html>";
        return ResponseEntity.ok().contentType(MediaType.TEXT_HTML).body(body);
    }
}
