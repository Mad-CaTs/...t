package world.inclub.bonusesrewards.carbonus.infrastructure.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.application.usecase.carassignmentdocument.detail.*;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarAssignmentDocumentDetail;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarAssignmentDocumentSummary;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.constants.CarBonusApiPaths.AssignmentDocuments;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request.CarAssignmentDocumentSummarySearchRequest;
import world.inclub.bonusesrewards.shared.response.ApiResponse;
import world.inclub.bonusesrewards.shared.response.ResponseHandler;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PagedData;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;
import world.inclub.bonusesrewards.shared.utils.pagination.infrastructure.dto.PaginationRequest;
import world.inclub.bonusesrewards.shared.utils.pagination.infrastructure.utils.PageableUtils;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping(AssignmentDocuments.DETAIL)
public class CarAssignmentDocumentDetailController {

    private final GetCarAssignmentDocumentDetailUseCase getCarAssignmentDocumentDetailUseCase;
    private final GetCarAssignmentDocumentSummaryUseCase getCarAssignmentDocumentSummaryUseCase;

    @GetMapping
    public Mono<ResponseEntity<ApiResponse<PagedData<CarAssignmentDocumentSummary>>>> getAll(
            @Valid @ModelAttribute PaginationRequest pagination,
            @Valid @ModelAttribute CarAssignmentDocumentSummarySearchRequest request
    ) {
        Pageable pageable = PageableUtils.createPageable(pagination, "updatedAt");
        return ResponseHandler.generateResponse(
                HttpStatus.OK,
                getCarAssignmentDocumentSummaryUseCase
                        .getAll(request.member(), request.rankId(), request.documentCount(), pageable),
                true
        );
    }

    @GetMapping("/{carAssignmentId}")
    public Mono<ResponseEntity<ApiResponse<List<CarAssignmentDocumentDetail>>>> getByCarAssignmentId(
            @PathVariable UUID carAssignmentId
    ) {
        return ResponseHandler.generateResponse(
                HttpStatus.OK,
                getCarAssignmentDocumentDetailUseCase.getByCarAssignmentId(carAssignmentId),
                true
        );
    }

}