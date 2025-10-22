package world.inclub.membershippayment.api;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;
import lombok.extern.slf4j.Slf4j;
import world.inclub.membershippayment.aplication.service.MovementPointService;
import world.inclub.membershippayment.aplication.service.MultiCodeService;
import world.inclub.membershippayment.aplication.service.SuscriptionService;
import world.inclub.membershippayment.crosscutting.utils.ConstantFields;
import world.inclub.membershippayment.crosscutting.utils.handler.ResponseHandler;
import world.inclub.membershippayment.domain.dto.request.ReleasePointsRequest;
import world.inclub.membershippayment.domain.dto.request.SuscriptionRequest;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/membership")
public class SuscriptionController {

    private final SuscriptionService suscriptionService;

    private final MovementPointService movementPointService;
    private final MultiCodeService multiCodeService;


    @PostMapping
    public Mono<ResponseEntity<Object>> portSuscription(@RequestBody SuscriptionRequest suscriptionRequest){
        log.info("SuscriptionRequest RECIBIDO en el Controller: {}", suscriptionRequest.toString());
        return ResponseHandler.generateMonoResponse(
                HttpStatus.CREATED,
                suscriptionService.postSuscription(suscriptionRequest)
                        .map(Object.class::cast),
                true
        );
    }

    @GetMapping("/multi-code/valid-subscriptions")
    public Mono<ResponseEntity<Object>> getAllSubscriptionsValidForTransfer(@RequestParam(name = "register-type") Integer registerType,
                                                                            @RequestParam(name = "id-parent") Integer parentId) {
        if (!registerType.equals(ConstantFields.RegisterType.MULTI_ACCOUNT)) {
            return ResponseHandler.generateMonoResponse(
                    HttpStatus.BAD_REQUEST,
                    Mono.just("Invalid register type.").map(Object.class::cast),
                    false
            );
        }
        return ResponseHandler.generateMonoResponse(
                HttpStatus.OK,
                multiCodeService.getAllSubscriptionsValid(parentId)
                        .collectList()
                        .map(Object.class::cast),
                true
        );
    }

   @GetMapping("/release-points/{idUser}/{idSuscription}")
    public Mono<ResponseEntity<Object>> getReleasePoints(
            @PathVariable Integer idUser,
            @PathVariable Integer idSuscription) {
        return ResponseHandler.generateMonoResponse(
                HttpStatus.OK,
                suscriptionService.getReleasePoints(idUser, idSuscription)
                        .map(Object.class::cast),
                true
        );
    }

    @PostMapping("/release-points")
    public Mono<ResponseEntity<Object>> releasePoints(
            @RequestBody ReleasePointsRequest request
    ) {
        return ResponseHandler.generateMonoResponse(
                HttpStatus.OK,
                suscriptionService.releasePoints(request)
                    .map(Object.class::cast),
                true
        )
        .defaultIfEmpty(ResponseEntity.notFound().build());
    }


    @GetMapping("/movements/user/{idUser}")
    public Mono<ResponseEntity<Object>> getMovementsByUser(@PathVariable Integer idUser) {
        return ResponseHandler.generateMonoResponse(
                HttpStatus.OK,
                movementPointService.getMovementsByUser(idUser)
                        .collectList()
                        .map(Object.class::cast),
                true
        )
        .defaultIfEmpty(ResponseEntity.notFound().build());
    }


    @GetMapping("/suscriptions/expirationDays/{idUser}")
    public Mono<ResponseEntity<Object>> getSuscriptionsAndDaysDTO(@PathVariable Integer idUser) {
        return ResponseHandler.generateMonoResponse(
                        HttpStatus.OK,
                        suscriptionService.getSuscriptionsAndDaysDTO(idUser)
                                .map(Object.class::cast),
                        true
                )
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
}
