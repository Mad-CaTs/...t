package world.inclub.membershippayment.aplication.service;

import io.github.resilience4j.circuitbreaker.CallNotPermittedException;
import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import io.github.resilience4j.reactor.circuitbreaker.operator.CircuitBreakerOperator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
import world.inclub.membershippayment.crosscutting.utils.TimeLima;
import world.inclub.membershippayment.domain.dto.request.PointsToRewardsRequest;
import world.inclub.membershippayment.domain.dto.request.ReleasePointsRequest;
import world.inclub.membershippayment.domain.dto.request.UserDTO;
import world.inclub.membershippayment.domain.dto.response.*;
import world.inclub.membershippayment.domain.entity.*;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.AdminPanelService;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.ObjModel;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.PackageDTO;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.TypeExchangeResponse;
import world.inclub.membershippayment.domain.dto.request.SuscriptionRequest;

import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.PackageDetail;
import world.inclub.membershippayment.infraestructure.repository.PointsExchangeHistoryRepository;
import world.inclub.membershippayment.infraestructure.repository.SuscriptionRepository;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import world.inclub.membershippayment.infraestructure.apisExternas.collaborator.CollaboratorService;
import world.inclub.membershippayment.infraestructure.apisExternas.collaborator.dtos.CollaboratorValidationResponseDTO;
@Service
@Slf4j
@RequiredArgsConstructor
public class SuscriptionService {
    private final PaymentService paymentService;
    private final AdminPanelService adminPanelService;
    private final CircuitBreakerRegistry circuitBreakerRegistry;
    private final SuscriptionRepository suscriptionRepository;
    private final MovementPointService movementPointService;
    private final PointsExchangeHistoryRepository pointsExchangeHistoryRepository;
    private final UserPointsBalanceService userPointsBalanceService;
    private final PointsExchangeHistoryService pointsExchangeHistoryService;
    private final UserRewardsService userRewardsService;
    private final MultiCodeService multiCodeService;
    private final CollaboratorService collaboratorService;




    public Mono<Boolean> postSuscription(SuscriptionRequest suscriptionRequest) {

        // Preguntar si el usuario es colaborador
        String dni = Optional.ofNullable(suscriptionRequest.getUser())
                .map(u -> u.getNroDocument())
                .orElse(null);

        Mono<Boolean> collab$ = (dni != null)
                ? collaboratorService.isCollaborator(dni)
                : Mono.just(false);

        // Encapsulamos todo el flujo existente dentro del flatMap
        return collab$.flatMap(isCollab -> {

            log.info("PostSuscription – isCollaborator={}", isCollab);
            CircuitBreaker circuitBreaker = circuitBreakerRegistry.circuitBreaker("postSuscription");

            /* Caso especial: transferencia multi-code */
            if (multiCodeService.validateMultiAccountAndSubscription(suscriptionRequest)) {
                return multiCodeService.processMultiCodeTransferSubscription(suscriptionRequest);
            }

            /* Flujo normal de compra de suscripción */
            return adminPanelService
                    .getPackData(
                            suscriptionRequest.getPackageId(),
                            suscriptionRequest.getPaymentSubTypeId())
                    .flatMap(objModel -> validateQuotesInitial(
                            suscriptionRequest.getNumberPaymentInitials(),
                            objModel.getPackageInfo().getPackageDetail())
                            .flatMap(pkgDetail -> {

                                /* Construimos la entidad Suscription */
                                Suscription suscription = new Suscription();
                                suscription.setCreationDate(TimeLima.getLimaTime());
                                suscription.setIsMigrated(0);
                                suscription.setIdPackageDetail(Math.toIntExact(
                                        objModel.getPackageInfo().getPackageDetail()
                                                .get(0).getIdPackageDetail()));
                                suscription.setIdPackage(objModel.getPackageInfo().getIdPackage());
                                suscription.setIdGracePeriodParameter(
                                        suscriptionRequest.getGracePeriodParameterId());

                                return adminPanelService.getTypeExchange()
                                        .flatMap(typeExchange -> processPayment(
                                                suscriptionRequest,
                                                suscription,
                                                objModel,
                                                typeExchange,
                                                isCollab
                                        ));
                            }))
                    .transformDeferred(CircuitBreakerOperator.of(circuitBreaker))
                    .doOnError(CallNotPermittedException.class, e -> {
                        log.error("Circuit Breaker is open. Fallback logic here.", e);
                        throw new RuntimeException("API service is unavailable");
                    });
        });
    }


    private Mono<PackageDetail> validateQuotesInitial(Integer NumberPaymentInitials,
            List<PackageDetail> packageDetail) {
        if (packageDetail.get(0).getNumberInitialQuote() >= NumberPaymentInitials) {
            return Mono.just(packageDetail.get(0));
        } else {
            log.error("You are submitting an initial split number that is not allowed for this subscription package");
            return Mono.error(new RuntimeException(
                    "You are submitting an initial split number that is not allowed for this subscription package"));
        }
    }

    private Mono<Boolean> processPayment(SuscriptionRequest req,
                                         Suscription suscription,
                                         ObjModel objModel,
                                         TypeExchangeResponse typeExchange,
                                         boolean isCollaborator) {
        return paymentService.processPayment(
                req, suscription, objModel, typeExchange, isCollaborator);
    }


    public Mono<ReleasePointsDTO> getReleasePoints(Integer idUser, Integer idSuscription) {
        return suscriptionRepository
                .findByIdUserAndIdSuscription(idUser, idSuscription)
                .switchIfEmpty(Mono.error(new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No se encontró la suscripción para el usuario " + idUser + " con idSuscription " + idSuscription
                )))
                .flatMap(suscription ->
                        adminPanelService.getPackageData(suscription.getIdPackage(), suscription.getIdPackageDetail())
                                .publishOn(Schedulers.boundedElastic())
                                .map(packageDTO -> {
                                    PackageDetail pd = packageDTO.getPackageDetail()
                                            .stream()
                                            .filter(detail -> detail.getIdPackageDetail() != null &&
                                                    detail.getIdPackageDetail().equals(Long.valueOf(suscription.getIdPackageDetail())))
                                            .findFirst()
                                            .orElse(null);
                                    ReleasePointsDTO response = new ReleasePointsDTO();
                                    if (pd != null) {
                                        response.setPoints(pd.getPoints());
                                        response.setIntervalReleaseInstallments(pd.getInstallmentInterval());
                                    } else {
                                        response.setPoints(0);
                                        response.setIntervalReleaseInstallments(0);
                                    }
                                    response.setNamePackage(packageDTO.getName());
                                    response.setAssignedPoints(suscription.getAssignedPoints());
                                    response.setPortfolio(packageDTO.getFamily().getName());
                                    Integer totalPaids = paymentService.getTotalPayments(idSuscription, 1).block();
                                    response.setPaidInstallments(totalPaids);
                                    return response;
                                })
                );
    }

    @Transactional
    public Mono<ReleasePointsResponse> releasePoints(ReleasePointsRequest request) {
        return suscriptionRepository.findByIdUserAndIdSuscription(
                    request.getIdUser(),
                    request.getIdSuscription()
                )
                .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "No se encontró la suscripción con los datos proporcionados.")))
                .zipWhen(suscription -> adminPanelService.getPackageData(
                        suscription.getIdPackage(),
                        suscription.getIdPackageDetail()
                ))
                .flatMap(tuple -> {
                    Suscription suscription = tuple.getT1();
                    PackageDTO packageDTO = tuple.getT2();

                    Integer assignedPoints = suscription.getAssignedPoints() != null ? suscription.getAssignedPoints() : 0;
                    Integer pointsToRelease = request.getPointsToRelease() != null ? request.getPointsToRelease() : 0;
                    if (assignedPoints < pointsToRelease) {
                        return Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                "No tiene suficientes puntos para liberar."));
                    }

                    suscription.setAssignedPoints(assignedPoints - pointsToRelease);
                    if (suscription.getCanjeCount() == null) {
                        suscription.setCanjeCount(0);
                    }
                    Integer nextCanjeNumber = suscription.getCanjeCount() + 1;
                    suscription.setCanjeCount(nextCanjeNumber);

                    return suscriptionRepository.save(suscription)
                        .flatMap(updatedSuscription -> {
                            Integer idFamily = null;
                            if (packageDTO.getFamily() != null) {
                                idFamily = packageDTO.getFamily().getIdFamilyPackage();
                            } else {
                                idFamily = 0;
                            }

                            return userPointsBalanceService.updateBalance(
                                            updatedSuscription.getIdUser(),
                                            idFamily,
                                            pointsToRelease
                                    )
                                .flatMap(updatedBalance -> {
                                    String membershipName = packageDTO.getName();
                                    String portfolio;
                                    if (packageDTO.getFamily() != null && packageDTO.getFamily().getName() != null) {
                                        portfolio = packageDTO.getFamily().getName();
                                    } else {
                                        portfolio = "Ribera";
                                    }
                                    String info = "Liberación de puntos";

                                    return movementPointService.registerMovement(
                                            updatedSuscription.getIdSuscription(),
                                            info,
                                            membershipName,
                                            portfolio,
                                            -request.getPointsToRelease(),
                                            "Liberados",
                                            request.getIdUser()
                                    ).thenReturn(buildReleasePointsResponse(updatedSuscription, request.getPointsToRelease(), nextCanjeNumber));
                                });
                        });
                });
    }


    private ReleasePointsResponse buildReleasePointsResponse(Suscription updated, Integer releasedPoints, Integer canjeNumber) {
        ReleasePointsResponse response = new ReleasePointsResponse();
        response.setIdUser(updated.getIdUser());
        response.setIdPackage(updated.getIdPackage());
        response.setIdPackageDetail(updated.getIdPackageDetail());
        response.setReleasedPoints(releasedPoints);
        response.setRemainingAssignedPts(updated.getAssignedPoints());
        response.setPaidInstallments(updated.getPaidInstallments());
        response.setMessage("Puntos liberados correctamente (Canje N° " + canjeNumber + ")");
        return response;
    }


    @Transactional
    public Mono<PointsToRewardsResponse> convertPointsToRewards(PointsToRewardsRequest request) {
        return adminPanelService.getFamilyData(request.getIdFamily())
            .switchIfEmpty(Mono.error(new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "No se encontró la familia con el id proporcionado."
            )))
            .zipWith(userPointsBalanceService.getBalanceByUserAndFamily(request.getIdUser(), request.getIdFamily()))
            .flatMap(tuple -> {
                FamilyPackageDTO family = tuple.getT1();
                UserPointsBalance balance = tuple.getT2();

                Integer liberatedPoints = (balance.getLiberatedPoints() != null) ? balance.getLiberatedPoints() : 0;
                Integer pointsToConvert = (request.getPointsToConvert() != null) ? request.getPointsToConvert() : 0;

                if (liberatedPoints < pointsToConvert) {
                    return Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "No tienes suficientes puntos liberados para convertir a rewards."));
                }

                return userPointsBalanceService.updateBalance(
                            request.getIdUser(),
                            request.getIdFamily(),
                            -pointsToConvert
                       )
                       .zipWhen(updatedBalance -> userRewardsService.updateRewards(request.getIdUser(), pointsToConvert))
                       .flatMap(tuple2 -> {
                            UserPointsBalance updatedBalance = tuple2.getT1();
                            UserRewards updatedRewards = tuple2.getT2();

                            PointsToRewardsResponse resp = new PointsToRewardsResponse();
                            resp.setIdUser(request.getIdUser());
                            resp.setConvertedPoints(pointsToConvert);
                            resp.setRemainingPoints(updatedBalance.getLiberatedPoints());
                            resp.setTotalRewards(updatedRewards.getRewards());
                            resp.setMessage("Conversión de puntos liberados a rewards realizada con éxito.");

                            String membershipName = family.getName();
                            String portfolio = family.getName();

                            return pointsExchangeHistoryService.registerPointsExchangeHistory(
                                        0L,
                                        request.getIdUser(),
                                        pointsToConvert,
                                        -pointsToConvert,
                                        "no aplica",
                                        portfolio,
                                        "Conversión de puntos liberados a rewards"
                                  )
                                  // Luego, registramos el movimiento de conversión
                                  .then(
                                      movementPointService.registerMovement(
                                          0L, // Id de suscripción; cámbialo según tu lógica
                                          "Conversión a rewards",
                                          "no aplica",
                                          portfolio,
                                          pointsToConvert,
                                          "CONVERTIDO",
                                          request.getIdUser()
                                      )
                                  )
                                  .thenReturn(resp);
                       });
            });
    }


    public Flux<PointsExchangeHistoryResponseDTO> getHistoryByUser(Integer idUser) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        return pointsExchangeHistoryRepository.findAllByIdUser(idUser)
            .map(history -> PointsExchangeHistoryResponseDTO.builder()
                .idMovementExchangeHistory(history.getIdMovementExchangeHistory())
                .idUser(history.getIdUser())
                .movementDate(history.getMovementDate().toLocalDate().format(formatter))
                .rewards(history.getRewards())
                .pointsUsed(history.getPointsUsed())
                .portfolio(history.getPortfolio())
                .observation(history.getObservation())
                .build());
    }


    public Flux<UserFamilyPointsDTO> getFamiliesPointsByUser(int idUser) {
        return suscriptionRepository.findDistinctIdPackageByIdUser(idUser)
            .flatMap(idPackage ->
                adminPanelService.getPackDataWithoutSubType(idPackage)
                    .flatMap(objModel -> {
                        int idFamilyPackage = objModel.getPackageInfo().getIdFamilyPackage();

                        return adminPanelService.getFamilyData(idFamilyPackage)
                            .flatMap(family -> {
                                return userPointsBalanceService.getBalanceByUserAndFamily(idUser, family.getIdFamilyPackage())
                                    .map(balance -> {
                                        UserFamilyPointsDTO dto = new UserFamilyPointsDTO();
                                        dto.setIdFamily(family.getIdFamilyPackage());
                                        dto.setFamilyName(family.getName());
                                        dto.setLiberatedPoints(balance.getLiberatedPoints());
                                        return dto;
                                    });
                            });
                    })
            );
    }

    public Mono<List<SuscriptionAndDaysDTO>> getSuscriptionsAndDaysDTO(Integer idUser) {
        return suscriptionRepository.findAllByIdUser(idUser)  // Obtener todas las suscripciones por idUser
                .flatMap(suscription ->
                        paymentService.getDaysForNextExpiration(suscription.getIdSuscription().intValue())  // Obtener días de expiración por cada suscripción
                                .map(daysDTO -> new SuscriptionAndDaysDTO(suscription.getIdSuscription().intValue(), daysDTO.getDaysNextExpiration(), daysDTO.getDateNotification(), daysDTO.getDateExpiration(), daysDTO.getDaysToAnnualLiquidation(), daysDTO.getLiquidationDate()))  // Mapear al DTO de Suscripción y días
                )
                .collectList();  // Colectar los resultados en una lista
    }

    public Mono<SuscriptionResponse> getSubscriptionById(Integer idSuscription) {
        return suscriptionRepository.findById(idSuscription.longValue())
                .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "No se encontró la suscripción con idSuscription " + idSuscription)))
                .flatMap(suscription -> {
                    SuscriptionResponse response = new SuscriptionResponse();
                    response.setId(suscription.getIdSuscription());
                    response.setIdUser(suscription.getIdUser());
                    response.setIdPackage(suscription.getIdPackage());
                    response.setPackageDetailId(suscription.getIdPackageDetail());
                    return Mono.just(response);
                });
    }

}
