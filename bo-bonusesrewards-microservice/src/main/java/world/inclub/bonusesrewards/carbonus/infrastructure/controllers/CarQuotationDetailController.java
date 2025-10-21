package world.inclub.bonusesrewards.carbonus.infrastructure.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.application.usecase.carquotation.detail.*;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarQuotationDetail;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarQuotationPendingAssignment;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarQuotationSelected;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarQuotationSummary;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.constants.CarBonusApiPaths.Quotation;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.excel.CarQuotationSelectedExelResponse;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.excel.CarQuotationSummaryExelResponse;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request.CarQuotationSelectedSearchRequest;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request.CarQuotationSummarySearchRequest;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carquotation.CarQuotationSelectedExelResponseMapper;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carquotation.CarQuotationSummaryExelResponseMapper;
import world.inclub.bonusesrewards.shared.response.ApiResponse;
import world.inclub.bonusesrewards.shared.response.ResponseHandler;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PagedData;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;
import world.inclub.bonusesrewards.shared.utils.pagination.infrastructure.dto.PaginationRequest;
import world.inclub.bonusesrewards.shared.utils.pagination.infrastructure.utils.PageableUtils;
import world.inclub.bonusesrewards.shared.utils.reports.domain.ReportExporter;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping(Quotation.DETAIL)
public class CarQuotationDetailController {

    private final GetCarQuotationDetailByClassificationIdUseCase getCarQuotationDetailByClassificationIdUseCase;
    private final GetCarQuotationSummaryPageableUseCase getCarQuotationSummaryPageableUseCase;
    private final GetCarQuotationSummaryUseCase getCarQuotationSummaryUseCase;
    private final GetCarQuotationSelectedPageableUseCase getCarQuotationSelectedPageableUseCase;
    private final GetCarQuotationSelectedUseCase getCarQuotationSelectedUseCase;
    private final ReportExporter<CarQuotationSummaryExelResponse> reportExporter;
    private final GetCarQuotationPendingAssignmentUseCase getCarQuotationOverviewUseCase;
    
    private final ReportExporter<CarQuotationSelectedExelResponse> selectedReportExporter;

    private final CarQuotationSummaryExelResponseMapper carQuotationSummaryExelResponseMapper;
    private final CarQuotationSelectedExelResponseMapper carQuotationSelectedExelResponseMapper;

    @GetMapping("/pending-assignments")
    public Mono<ResponseEntity<ApiResponse<List<CarQuotationPendingAssignment>>>> getAllPending() {
        return ResponseHandler.generateResponse(
                HttpStatus.OK,
                getCarQuotationOverviewUseCase.getAllPending(),
                true
        );
    }

    @GetMapping
    public Mono<ResponseEntity<ApiResponse<PagedData<CarQuotationSummary>>>> getAllPageable(
            @Valid @ModelAttribute PaginationRequest pagination,
            @Valid @ModelAttribute CarQuotationSummarySearchRequest request
    ) {
        Pageable pageable = PageableUtils.createPageable(pagination, "last_quotation_date");
        return ResponseHandler.generateResponse(
                HttpStatus.OK,
                getCarQuotationSummaryPageableUseCase
                        .getAll(request.member(), request.rankId(), request.isReviewed(), pageable),
                true
        );
    }

    @GetMapping("/export")
    public Mono<ResponseEntity<byte[]>> exportAll(
            @Valid @ModelAttribute CarQuotationSummarySearchRequest request
    ) {
        return getCarQuotationSummaryUseCase
                .getAll(request.member(), request.rankId(), request.isReviewed())
                .map(carQuotationSummaryExelResponseMapper::toExelResponse)
                .collectList()
                .map(responses -> reportExporter
                        .export(responses, "reporte_proforma_vehiculos"))
                .map(bytes -> ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "attachment; filename=reporte_proforma_vehiculos.xlsx")
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .body(bytes));
    }

    @GetMapping("/selected")
    public Mono<ResponseEntity<ApiResponse<PagedData<CarQuotationSelected>>>> getSelected(
            @Valid @ModelAttribute PaginationRequest pagination,
            @Valid @ModelAttribute CarQuotationSelectedSearchRequest request
    ) {
        Pageable pageable = PageableUtils.createPageable(pagination, "accepted_at");
        return ResponseHandler.generateResponse(
                HttpStatus.OK,
                getCarQuotationSelectedPageableUseCase
                        .getAll(request.member(), request.rankId(), pageable),
                true
        );
    }

    @GetMapping("/selected/export")
    public Mono<ResponseEntity<byte[]>> exportSelected(
            @Valid @ModelAttribute CarQuotationSelectedSearchRequest request
    ) {
        return getCarQuotationSelectedUseCase
                .getAll(request.member(), request.rankId())
                .map(carQuotationSelectedExelResponseMapper::toExelResponse)
                .collectList()
                .map(responses -> selectedReportExporter
                        .export(responses, "reporte_proformas_seleccionadas"))
                .map(bytes -> ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "attachment; filename=reporte_proformas_seleccionadas.xlsx")
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .body(bytes));
    }

    @GetMapping("/{classificationId}")
    public Mono<ResponseEntity<ApiResponse<List<CarQuotationDetail>>>> getDetails(@PathVariable UUID classificationId) {
        return ResponseHandler.generateResponse(
                HttpStatus.OK,
                getCarQuotationDetailByClassificationIdUseCase.getByClassificationId(classificationId),
                true
        );
    }

}
