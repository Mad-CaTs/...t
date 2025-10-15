package world.inclub.bonusesrewards.carbonus.infrastructure.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import world.inclub.bonusesrewards.carbonus.application.usecase.carassignment.detail.active.GetAllCarAssignmentsActiveUseCase;
import world.inclub.bonusesrewards.carbonus.application.usecase.carassignment.detail.active.SearchActiveCarAssignmentsUseCase;
import world.inclub.bonusesrewards.carbonus.domain.criteria.CarAssignmentsActiveSearchCriteria;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.constants.CarBonusApiPaths.CarsAssignments;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request.CarAssignmentsActiveSearchRequest;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.response.CarAssignmentsActiveResponse;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carassignmentsactive.CarAssignmentsActiveResponseMapper;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carassignmentsactive.CarAssignmentsActiveSearchRequestMapper;
import world.inclub.bonusesrewards.shared.response.ApiResponse;
import world.inclub.bonusesrewards.shared.response.ResponseHandler;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PagedData;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;
import world.inclub.bonusesrewards.shared.utils.pagination.infrastructure.dto.PaginationRequest;
import world.inclub.bonusesrewards.shared.utils.pagination.infrastructure.utils.PageableUtils;
import world.inclub.bonusesrewards.shared.utils.reports.domain.ReportExporter;

@RestController
@RequiredArgsConstructor
@RequestMapping(CarsAssignments.ACTIVE)
public class CarAssignmentsActiveController {

    private final GetAllCarAssignmentsActiveUseCase getAllCarAssignmentsActiveUseCase;
    private final SearchActiveCarAssignmentsUseCase searchActiveCarAssignmentsUseCase;
    private final ReportExporter<CarAssignmentsActiveResponse> reportExporter;

    private final CarAssignmentsActiveResponseMapper carAssignmentsActiveResponseMapper;
    private final CarAssignmentsActiveSearchRequestMapper carAssignmentsActiveSearchRequestMapper;

    @GetMapping("/export")
    public Mono<ResponseEntity<byte[]>> exportExcel() {
        return getAllCarAssignmentsActiveUseCase.getAll()
                .map(carAssignmentsActiveResponseMapper::toResponse)
                .collectList()
                .map(responses -> reportExporter
                        .export(responses, "reporte_asignaciones_activas"))
                .map(bytes -> ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "attachment; filename=reporte_asignaciones_activas.xlsx")
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .body(bytes));
    }

    @GetMapping("/search")
    public Mono<ResponseEntity<ApiResponse<PagedData<CarAssignmentsActiveResponse>>>> searchActiveCarAssignments(
            @Valid @ModelAttribute PaginationRequest pagination,
            @Valid @ModelAttribute CarAssignmentsActiveSearchRequest criteriaRequest
    ) {
        CarAssignmentsActiveSearchCriteria criteria = carAssignmentsActiveSearchRequestMapper.toDomain(criteriaRequest);
        Pageable pageable = PageableUtils.createPageable(pagination, "assigned_date");

        return searchActiveCarAssignmentsUseCase
                .searchActiveCarAssignments(criteria, pageable)
                .map(carAssignmentsActiveResponseMapper::toResponse)
                .flatMap(pagedData -> ResponseHandler.generateResponse(HttpStatus.OK, pagedData, true));
    }
}