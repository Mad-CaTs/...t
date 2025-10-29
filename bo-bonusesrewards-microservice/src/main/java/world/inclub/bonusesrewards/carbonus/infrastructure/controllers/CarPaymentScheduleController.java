package world.inclub.bonusesrewards.carbonus.infrastructure.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.application.usecase.carpaymentschedule.*;
import world.inclub.bonusesrewards.carbonus.domain.model.CarPaymentSchedule;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.constants.CarBonusApiPaths.PaymentSchedules;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.excel.CarPaymentScheduleExelResponse;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request.CarPaymentScheduleInstallmentsRequest;
import world.inclub.bonusesrewards.carbonus.application.dto.CarPaymentScheduleExtraInfoSummary;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request.CarPaymentScheduleSearchRequest;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.response.CarPaymentScheduleResponse;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carpaymentschedule.CarPaymentScheduleExelResponseMapper;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carpaymentschedule.CarPaymentScheduleResponseMapper;
import world.inclub.bonusesrewards.shared.response.ApiResponse;
import world.inclub.bonusesrewards.shared.response.ResponseHandler;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PagedData;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;
import world.inclub.bonusesrewards.shared.utils.pagination.infrastructure.dto.PaginationRequest;
import world.inclub.bonusesrewards.shared.utils.pagination.infrastructure.utils.PageableUtils;
import world.inclub.bonusesrewards.shared.utils.reports.domain.ReportExporter;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping(PaymentSchedules.BASE)
public class CarPaymentScheduleController {

    private final CreateCarPaymentInstallmentsUseCase createCarPaymentInstallmentsUseCase;
    private final GetAllCarPaymentSchedulesUseCase getAllCarPaymentSchedulesUseCase;
    private final SearchCarPaymentSchedulesUseCase searchCarPaymentSchedulesUseCase;
    private final SearchCarPaymentScheduleInitialsUseCase searchCarPaymentScheduleInitialsUseCase;
    private final ReportExporter<CarPaymentScheduleExelResponse> reportExporter;

    private final CarPaymentScheduleExelResponseMapper carPaymentScheduleExelResponseMapper;
    private final CarPaymentScheduleResponseMapper carPaymentScheduleResponseMapper;
    private final GetCarPaymentScheduleExtraInfoUseCase getCarPaymentScheduleExtraInfoUseCase;

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

    @GetMapping("/export/{carAssignmentId}")
    public Mono<ResponseEntity<byte[]>> exportCarPaymentSchedules(
            @PathVariable UUID carAssignmentId
    ) {
        return getAllCarPaymentSchedulesUseCase
                .findByCarAssignmentId(carAssignmentId)
                .map(carPaymentScheduleExelResponseMapper::toResponse)
                .collectList()
                .map(responses -> {
                    byte[] bytes = reportExporter
                            .export(responses, "reporte_cronograma_pagos_vehiculo");
                    return ResponseEntity.ok()
                            .header(HttpHeaders.CONTENT_DISPOSITION,
                                    "attachment; filename=reporte_car_payment_schedules.xlsx")
                            .contentType(MediaType.APPLICATION_OCTET_STREAM)
                            .body(bytes);
                });
    }

    @GetMapping("/search/{carAssignmentId}")
    public Mono<ResponseEntity<ApiResponse<PagedData<CarPaymentScheduleResponse>>>> searchCarPaymentSchedules(
            @PathVariable UUID carAssignmentId,
            @Valid @ModelAttribute PaginationRequest pagination,
            @Valid @ModelAttribute CarPaymentScheduleSearchRequest request
    ) {
        Pageable pageable = PageableUtils.createPageable(pagination, "orderNum");

        return searchCarPaymentSchedulesUseCase
                .searchCarPaymentSchedules(carAssignmentId, request.numberOfInstallments(), request.statusCode(), pageable)
                .map(carPaymentScheduleResponseMapper::toResponse)
                .flatMap(pagedData ->
                                 ResponseHandler.generateResponse(HttpStatus.OK, pagedData, true));
    }

    @GetMapping("/initials/{carAssignmentId}")
    public Mono<ResponseEntity<ApiResponse<PagedData<CarPaymentScheduleResponse>>>> getAllInitialCarPaymentSchedules(
            @PathVariable UUID carAssignmentId,
            @Valid @ModelAttribute PaginationRequest pagination
    ) {
        Pageable pageable = PageableUtils.createPageable(pagination, "orderNum");
        return searchCarPaymentScheduleInitialsUseCase
                .searchInitials(carAssignmentId, pageable)
                .map(carPaymentScheduleResponseMapper::toResponse)
                .flatMap(pagedData ->
                                 ResponseHandler.generateResponse(HttpStatus.OK, pagedData, true));
    }

    @GetMapping("/extra-info/{carAssignmentId}")
    public Mono<ResponseEntity<ApiResponse<CarPaymentScheduleExtraInfoSummary>>> getExtraInfo(
            @PathVariable UUID carAssignmentId
    ) {
        return getCarPaymentScheduleExtraInfoUseCase.getExtraInfo(carAssignmentId)
                .flatMap(data -> ResponseHandler.generateResponse(HttpStatus.OK, data, true));
    }

}
