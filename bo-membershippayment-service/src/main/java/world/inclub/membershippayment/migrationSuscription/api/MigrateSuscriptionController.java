package world.inclub.membershippayment.migrationSuscription.api;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.crosscutting.utils.handler.ResponseHandler;
import world.inclub.membershippayment.migrationSuscription.application.service.interfaces.IMigrateSuscriptionDataService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/migrateData")
public class MigrateSuscriptionController {

    private final IMigrateSuscriptionDataService migrateSuscriptionDataService;


    @GetMapping("/suscriptions/{idSuscription}/payment_vouchers")
    public Mono<ResponseEntity<Object>> getAllPaymentVoucherByIdSuscription(@PathVariable Integer idSuscription){
        return ResponseHandler.generateMonoResponse(
                HttpStatus.OK,
                migrateSuscriptionDataService.getAllPaymentVoucherByIdSuscription(idSuscription)
                        .map(Object.class::cast),
                true
        );
    }

    @GetMapping("/suscriptions/{idSuscription}")
    public Mono<ResponseEntity<Object>> getSuscriptionById(@PathVariable Long idSuscription){
        return ResponseHandler.generateMonoResponse(
                HttpStatus.OK,
                migrateSuscriptionDataService.getSuscriptionByIdSuscription(idSuscription)
                        .map(Object.class::cast),
                true
        );
    }

    @GetMapping("/suscriptions/{idSuscription}/schedule")
    public Mono<ResponseEntity<Object>> getScheduleById(@PathVariable Integer idSuscription){
        return ResponseHandler.generateMonoResponse(
                HttpStatus.OK,
                migrateSuscriptionDataService.getScheduleByidSuscription(idSuscription)
                        .map(Object.class::cast),
                    true
        );
    }
}
