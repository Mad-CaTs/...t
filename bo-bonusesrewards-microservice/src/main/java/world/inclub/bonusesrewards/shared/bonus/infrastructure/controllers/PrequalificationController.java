package world.inclub.bonusesrewards.shared.bonus.infrastructure.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.bonus.application.usecase.member.GetPrequalificationsUseCase;
import world.inclub.bonusesrewards.shared.bonus.application.usecase.member.SearchPrequalificationsUseCase;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.controllers.constants.BonusApiPaths.Prequalifications;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.controllers.dto.request.PrequalificationRequest;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.controllers.dto.response.PrequalificationResponse;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.controllers.dto.response.PrequalificationExcelResponse;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.controllers.mapper.PrequalificationResponseMapper;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.controllers.mapper.PrequalificationExcelResponseMapper;
import world.inclub.bonusesrewards.shared.response.ApiResponse;
import world.inclub.bonusesrewards.shared.response.ResponseHandler;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PagedData;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;
import world.inclub.bonusesrewards.shared.utils.pagination.infrastructure.dto.PaginationRequest;
import world.inclub.bonusesrewards.shared.utils.pagination.infrastructure.utils.PageableUtils;
import world.inclub.bonusesrewards.shared.utils.reports.domain.ReportExporter;

@RestController
@RequiredArgsConstructor
@RequestMapping(Prequalifications.BASE)
public class PrequalificationController {

    private final GetPrequalificationsUseCase getPrequalificationsUseCase;
    private final SearchPrequalificationsUseCase searchPrequalificationsUseCase;
    private final ReportExporter<PrequalificationExcelResponse> reportExporter;
    private final PrequalificationResponseMapper prequalificationResponseMapper;
    private final PrequalificationExcelResponseMapper prequalificationExcelResponseMapper;

    @GetMapping("/export")
    public Mono<ResponseEntity<byte[]>> exportExcel(@Valid @ModelAttribute PrequalificationRequest request) {
        return getPrequalificationsUseCase.getPrequalifications(
                        request.periodMin(),
                        request.periodMax(),
                        request.rankId(),
                        request.minRequalifications())
                .map(prequalificationExcelResponseMapper::toResponse)
                .collectList()
                .map(responses -> reportExporter
                        .export(responses, "reporte_prequalifications"))
                .map(bytes -> ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "attachment; filename=reporte_prequalifications.xlsx")
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .body(bytes));
    }

    @GetMapping("/search")
    public Mono<ResponseEntity<ApiResponse<PagedData<PrequalificationResponse>>>> searchPrequalifications(
            @Valid @ModelAttribute PaginationRequest pagination,
            @Valid @ModelAttribute PrequalificationRequest criteriaRequest
    ) {
        Pageable pageable = PageableUtils.createPageable(pagination, "totalDirectPoints");

        return searchPrequalificationsUseCase
                .searchPrequalifications(
                        criteriaRequest.periodMin(),
                        criteriaRequest.periodMax(),
                        criteriaRequest.rankId(),
                        criteriaRequest.minRequalifications(),
                        pageable)
                .map(prequalificationResponseMapper::toResponse)
                .flatMap(pagedData -> ResponseHandler.generateResponse(HttpStatus.OK, pagedData, true));
    }

}