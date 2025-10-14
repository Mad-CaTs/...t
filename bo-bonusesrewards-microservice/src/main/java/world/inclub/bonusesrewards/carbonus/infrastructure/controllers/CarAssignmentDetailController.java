package world.inclub.bonusesrewards.carbonus.infrastructure.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import world.inclub.bonusesrewards.carbonus.application.usecase.carassignment.detail.all.GetCarAssignmentDetailByIdUseCase;
import world.inclub.bonusesrewards.carbonus.application.usecase.carassignment.detail.all.SearchCarAssignmentDetailsUseCase;
import world.inclub.bonusesrewards.carbonus.domain.criteria.CarAssignmentDetailSearchCriteria;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.constants.CarBonusApiPaths.CarsAssignments;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request.CarAssignmentDetailSearchRequest;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.response.CarAssignmentDetailsResponse;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carassignmentdetail.CarAssignmentDetailResponseMapper;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carassignmentdetail.CarDetailSearchRequestMapper;
import world.inclub.bonusesrewards.shared.response.ApiResponse;
import world.inclub.bonusesrewards.shared.response.ResponseHandler;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PagedData;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;
import world.inclub.bonusesrewards.shared.utils.pagination.infrastructure.dto.PaginationRequest;
import world.inclub.bonusesrewards.shared.utils.pagination.infrastructure.utils.PageableUtils;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping(CarsAssignments.DETAIL)
public class CarAssignmentDetailController {

    private final SearchCarAssignmentDetailsUseCase searchCarAssignmentDetailsUseCase;
    private final GetCarAssignmentDetailByIdUseCase getCarAssignmentDetailByIdUseCase;

    private final CarAssignmentDetailResponseMapper carAssignmentDetailResponseMapper;
    private final CarDetailSearchRequestMapper carDetailSearchRequestMapper;

    @GetMapping("/{id}")
    public Mono<ResponseEntity<ApiResponse<CarAssignmentDetailsResponse>>> getCarWithDetails(@PathVariable UUID id) {
        return getCarAssignmentDetailByIdUseCase.getCarDetails(id)
                .map(carAssignmentDetailResponseMapper::toCarDetailsResponse)
                .flatMap(carDetails -> ResponseHandler.generateResponse(HttpStatus.OK, carDetails, true));
    }

    @GetMapping("/search")
    public Mono<ResponseEntity<ApiResponse<PagedData<CarAssignmentDetailsResponse>>>> searchCars(
            @Valid @ModelAttribute PaginationRequest pagination,
            @Valid @ModelAttribute CarAssignmentDetailSearchRequest criteriaRequest
    ) {
        CarAssignmentDetailSearchCriteria criteria = carDetailSearchRequestMapper.toDomain(criteriaRequest);
        Pageable pageable = PageableUtils.createPageable(pagination, "created_at");

        return searchCarAssignmentDetailsUseCase
                .searchCarDetails(criteria, pageable)
                .map(carAssignmentDetailResponseMapper::toResponse)
                .flatMap(pagedData -> ResponseHandler.generateResponse(HttpStatus.OK, pagedData, true));
    }

}