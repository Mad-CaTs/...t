package world.inclub.bonusesrewards.shared.bonus.infrastructure.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.bonus.application.usecase.classification.ClassifyMemberUseCase;
import world.inclub.bonusesrewards.shared.bonus.application.usecase.classification.GetAllClassificationWithMemberUseCase;
import world.inclub.bonusesrewards.shared.bonus.application.usecase.classification.SearchClassificationsWithMemberUseCase;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.controllers.constants.BonusApiPaths.Classifications;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.controllers.dto.request.ClassificationSearchCriteriaRequest;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.controllers.dto.request.PrequalificationRequest;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.controllers.dto.response.ClassificationResponse;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.controllers.dto.response.ClassificationExcelResponse;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.controllers.mapper.ClassificationResponseMapper;
import world.inclub.bonusesrewards.shared.bonus.infrastructure.controllers.mapper.ClassificationExcelResponseMapper;
import world.inclub.bonusesrewards.shared.response.ApiResponse;
import world.inclub.bonusesrewards.shared.response.ResponseHandler;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PagedData;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;
import world.inclub.bonusesrewards.shared.utils.pagination.infrastructure.dto.PaginationRequest;
import world.inclub.bonusesrewards.shared.utils.pagination.infrastructure.utils.PageableUtils;
import world.inclub.bonusesrewards.shared.utils.reports.domain.ReportExporter;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(Classifications.BASE)
public class ClassificationController {

    private final ClassifyMemberUseCase classifyMemberUseCase;
    private final GetAllClassificationWithMemberUseCase getAllClassificationWithMemberUseCase;
    private final SearchClassificationsWithMemberUseCase searchClassificationsUseCase;
    private final ReportExporter<ClassificationExcelResponse> classificationReportExporter;
    private final ClassificationResponseMapper classificationResponseMapper;
    private final ClassificationExcelResponseMapper classificationExcelResponseMapper;

    @PostMapping("/{memberIds}")
    public Mono<ResponseEntity<ApiResponse<String>>> classifyMember(
            @PathVariable List<Long> memberIds,
            @Valid @RequestBody PrequalificationRequest request
    ) {
        return classifyMemberUseCase
                .classify(memberIds,
                          request.periodMin(),
                          request.periodMax(),
                          request.rankId(),
                          request.minRequalifications())
                .collectList()
                .flatMap(responses -> ResponseHandler.generateResponse(
                        HttpStatus.OK,
                        "Members classified successfully",
                        true));
    }

    @GetMapping("/export")
    public Mono<ResponseEntity<byte[]>> exportExcel(
            @Valid @ModelAttribute ClassificationSearchCriteriaRequest criteria
    ) {
        return getAllClassificationWithMemberUseCase
                .getAll(criteria.member(), criteria.rankId(), criteria.notificationStatus())
                .map(classificationExcelResponseMapper::toResponse)
                .collectList()
                .map(responses -> classificationReportExporter
                        .export(responses, "reporte_classifications"))
                .map(bytes -> ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "attachment; filename=reporte_classifications.xlsx")
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .body(bytes));
    }

    @GetMapping("/search")
    public Mono<ResponseEntity<ApiResponse<PagedData<ClassificationResponse>>>> searchClassifications(
            @Valid @ModelAttribute PaginationRequest pagination,
            @Valid @ModelAttribute ClassificationSearchCriteriaRequest criteria
    ) {
        Pageable pageable = PageableUtils.createPageable(pagination, "classificationDate");

        return searchClassificationsUseCase
                .searchClassifications(criteria.member(), criteria.rankId(), criteria.notificationStatus(), pageable)
                .map(classificationResponseMapper::toResponse)
                .flatMap(pagedData -> ResponseHandler.generateResponse(HttpStatus.OK, pagedData, true));
    }
}
