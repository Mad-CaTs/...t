package world.inclub.bonusesrewards.carbonus.infrastructure.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.application.usecase.carbonusapplication.GetPagedCarBonusApplicationsUseCase;
import world.inclub.bonusesrewards.carbonus.application.usecase.carbonusapplication.ListAllCarBonusApplicationsUseCase;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarBonusApplicationDetail;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.constants.CarBonusApiPaths.BonusApplication;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.excel.CarBonusApplicationDetailExelResponse;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request.CarBonusApplicationDetailSearchRequest;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carquotation.CarBonusApplicationDetailExelResponseMapper;
import world.inclub.bonusesrewards.shared.response.ApiResponse;
import world.inclub.bonusesrewards.shared.response.ResponseHandler;
import world.inclub.bonusesrewards.shared.utils.datetime.DateTimeFormatter;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PagedData;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;
import world.inclub.bonusesrewards.shared.utils.pagination.infrastructure.dto.PaginationRequest;
import world.inclub.bonusesrewards.shared.utils.pagination.infrastructure.utils.PageableUtils;
import world.inclub.bonusesrewards.shared.utils.reports.domain.ReportExporter;

import java.time.Instant;
import java.time.LocalDate;

@RestController
@RequiredArgsConstructor
@RequestMapping(BonusApplication.DETAIL)
public class CarBonusApplicationDetailController {

    private final GetPagedCarBonusApplicationsUseCase getPagedCarBonusApplicationsUseCase;
    private final ListAllCarBonusApplicationsUseCase listAllCarBonusApplicationsUseCase;
    private final ReportExporter<CarBonusApplicationDetailExelResponse> reportExporter;
    private final CarBonusApplicationDetailExelResponseMapper carBonusApplicationDetailExelResponseMapper;

    @GetMapping
    public Mono<ResponseEntity<ApiResponse<PagedData<CarBonusApplicationDetail>>>> getAllPageable(
            @Valid @ModelAttribute PaginationRequest pagination,
            @Valid @ModelAttribute CarBonusApplicationDetailSearchRequest request
    ) {
        Pageable pageable = PageableUtils.createPageable(pagination, "bonus_application_id");
        return ResponseHandler.generateResponse(
                HttpStatus.OK,
                getPagedCarBonusApplicationsUseCase
                        .getBonusApplicationDetails(request.member(),
                                                    getAppliedDateOrNull(request.appliedDate()),
                                                    request.bonusAmount(),
                                                    request.onlyInitial(),
                                                    pageable),
                true
        );
    }

    @GetMapping("/export")
    public Mono<ResponseEntity<byte[]>> exportAll(
            @Valid @ModelAttribute CarBonusApplicationDetailSearchRequest request
    ) {
        return listAllCarBonusApplicationsUseCase
                .getBonusApplicationDetails(request.member(),
                                            getAppliedDateOrNull(request.appliedDate()),
                                            request.bonusAmount(),
                                            request.onlyInitial())
                .map(carBonusApplicationDetailExelResponseMapper::toExelResponse)
                .collectList()
                .map(responses -> reportExporter
                        .export(responses, "reporte_pago_bono"))
                .map(bytes -> ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "attachment; filename=reporte_pago_bono.xlsx")
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .body(bytes));
    }

    private Instant getAppliedDateOrNull(LocalDate appliedDate) {
        return appliedDate != null ? DateTimeFormatter.toEndOfDayInstant(appliedDate) : null;
    }

}