package world.inclub.membershippayment.api;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.aplication.service.*;
import world.inclub.membershippayment.domain.dto.request.MovementPointRequest;
import world.inclub.membershippayment.domain.dto.request.PointsRedemptionHistoryRequest;
import world.inclub.membershippayment.domain.dto.request.PointsToRewardsRequest;
import world.inclub.membershippayment.crosscutting.utils.handler.ResponseHandler;
import world.inclub.membershippayment.domain.entity.MovementPoint;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/user-points-released")
public class UserPointsBalanceController {

    private final UserPointsBalanceService balanceService;

    private final SuscriptionService suscriptionService;

    private final PointsRedemptionHistoryService pointsRedemptionHistoryService;

    private final MovementPointService movementPointService;

    private final UserRewardsService userRewardsService;


    @GetMapping("/{idUser}/{idFamily}")
    public Mono<ResponseEntity<Object>> getBalanceByUserAndFamily(@PathVariable Integer idUser, @PathVariable Integer idFamily) {
        return ResponseHandler.generateMonoResponse(
                HttpStatus.OK,
                balanceService.getBalanceByUserAndFamily(idUser, idFamily)
                        .map(Object.class::cast),
                true
        ).defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @GetMapping("/points-exchange-history/user/{idUser}")
    public Mono<ResponseEntity<Object>> getPointsExchangeHistoryByUser(
            @PathVariable Integer idUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseHandler.generateMonoResponse(
                HttpStatus.OK,
                suscriptionService.getHistoryByUser(idUser)
                    .skip((long) page * size)
                    .take(size)
                    .collectList()
                    .map(Object.class::cast),
                true
        )
        .defaultIfEmpty(ResponseEntity.notFound().build());
    }


    @PostMapping("/points-released-to-rewards")
    public Mono<ResponseEntity<Object>> convertPointsToRewards(
            @RequestBody PointsToRewardsRequest request
    ) {
        return ResponseHandler.generateMonoResponse(
                HttpStatus.OK,
                suscriptionService.convertPointsToRewards(request)
                    .map(Object.class::cast),
                true
        )
        .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{idUser}/families/points")
    public Mono<ResponseEntity<Object>> getFamiliesPointsByUser(@PathVariable int idUser) {
        return ResponseHandler.generateMonoResponse(
            HttpStatus.OK,
            suscriptionService.getFamiliesPointsByUser(idUser)
                .distinct(dto -> dto.getIdFamily())
                .collectList()
                .map(Object.class::cast),
            true
        ).defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @GetMapping("/points-redemption-history/user/{idUser}")
    public Mono<ResponseEntity<Object>> getPointsRedemptionHistoryByUser(
            @PathVariable Integer idUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseHandler.generateMonoResponse(
                HttpStatus.OK,
                pointsRedemptionHistoryService.getRedemptionHistoryByUser(idUser)
                    .skip((long) page * size)
                    .take(size)
                    .collectList()
                    .map(Object.class::cast),
                true
        )
        .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PostMapping("/points-redemption-history")
    public Mono<ResponseEntity<Object>> createPointsRedemptionHistory(
            @RequestBody PointsRedemptionHistoryRequest request
    ) {
        return ResponseHandler.generateMonoResponse(
                        HttpStatus.CREATED,
                        pointsRedemptionHistoryService.createPointsRedemptionHistory(request)
                                .map(Object.class::cast),
                        true
                )
                .defaultIfEmpty(ResponseEntity.status(HttpStatus.BAD_REQUEST).build());
    }


    @PostMapping("/register")
    public Mono<ResponseEntity<MovementPoint>> registerMovement(@RequestBody MovementPointRequest request) {
        return movementPointService.registerMovement(
                    request.getIdSuscription(),
                    request.getInformation(),
                    request.getMembership(),
                    request.getPortfolio(),
                    request.getPoints(),
                    request.getStatus(),
                    request.getIdUser()
                )
                .map(movement -> ResponseEntity.status(HttpStatus.CREATED).body(movement))
                .defaultIfEmpty(ResponseEntity.status(HttpStatus.BAD_REQUEST).build());
    }

    @GetMapping("/user/{idUser}/rewards")
    public Mono<ResponseEntity<Object>> getRewardsByUser(@PathVariable int idUser) {
        return ResponseHandler.generateMonoResponse(
                HttpStatus.OK,
                userRewardsService.getRewardsByUser(idUser)
                        .map(Object.class::cast),
                true
        ).defaultIfEmpty(ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("No se encontró balance de rewards para el usuario con id " + idUser));
    }
}
