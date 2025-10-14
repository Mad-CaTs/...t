package world.inclub.bonusesrewards.carbonus.infrastructure.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.application.usecase.carpaymentschedule.CreateCarPaymentInstallmentsUseCase;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.constants.CarBonusApiPaths.PaymentSchedules;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request.CarPaymentScheduleInstallmentsRequest;
import world.inclub.bonusesrewards.shared.response.ApiResponse;
import world.inclub.bonusesrewards.shared.response.ResponseHandler;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping(PaymentSchedules.BASE)
public class CarPaymentScheduleController {

    private final CreateCarPaymentInstallmentsUseCase createCarPaymentInstallmentsUseCase;

    @PostMapping("/installments/{carAssignmentId}")
    public Mono<ResponseEntity<ApiResponse<String>>> createInstallments(
            @PathVariable UUID carAssignmentId,
            @Valid @RequestBody CarPaymentScheduleInstallmentsRequest request
    ) {
        return createCarPaymentInstallmentsUseCase.createInstallments(
                        carAssignmentId,
                        request.gpsAmount(),
                        request.insuranceAmount(),
                        request.mandatoryInsuranceAmount())
                .then(ResponseHandler.generateResponse(
                        HttpStatus.OK,
                        "Installments created successfully",
                        true
                ));
    }

}
