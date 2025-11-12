package world.inclub.transfer.liquidation.api.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.infraestructure.apisExternas.handler.ResponseHandler;
import world.inclub.transfer.liquidation.infraestructure.apisExternas.jobstatus.JobStatusService;
import world.inclub.transfer.liquidation.api.dtos.ReactivateRequest;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/jobstatus")
@RequiredArgsConstructor
@Slf4j
public class JobStatusController {

    private final JobStatusService jobStatusService;

    @PostMapping("/reactivatePostLiquidation")
    public Mono<ResponseEntity<Object>> reactivate(@RequestBody ReactivateRequest request) {
        log.info("Proxy /api/v1/jobstatus/reactivatePostLiquidation called with sponsor={} user={}", request.getIdSponsor(), request.getIdUser());

    Mono<Object> call = jobStatusService.reactivatePostLiquidation(request.getIdSponsor(), request.getIdUser())
        .then(Mono.just(Map.of("status", "ok")));

        return ResponseHandler.generateMonoResponse(HttpStatus.OK, call.map(Object.class::cast), true);
    }
}
