package world.inclub.bonusesrewards.carbonus.infrastructure.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.application.usecase.carrankbonus.detail.GetCarRankBonusDetailUseCase;
import world.inclub.bonusesrewards.carbonus.application.usecase.carrankbonus.detail.SearchCarRankBonusDetailUseCase;
import world.inclub.bonusesrewards.carbonus.domain.criteria.CarRankBonusDetailSearchCriteria;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.constants.CarBonusApiPaths.RankBonuses;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request.CarRankBonusDetailSearchRequest;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.response.CarRankBonusDetailResponse;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carrankbonusdetail.CarRankBonusDetailResponseMapper;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carrankbonusdetail.CarRankBonusDetailSearchRequestMapper;
import world.inclub.bonusesrewards.shared.response.ApiResponse;
import world.inclub.bonusesrewards.shared.response.ResponseHandler;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PagedData;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;
import world.inclub.bonusesrewards.shared.utils.pagination.infrastructure.dto.PaginationRequest;
import world.inclub.bonusesrewards.shared.utils.pagination.infrastructure.utils.PageableUtils;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping(RankBonuses.DETAIL)
public class CarRankBonusDetailController {

    private final SearchCarRankBonusDetailUseCase searchCarRankBonusDetailUseCase;
    private final GetCarRankBonusDetailUseCase getCarRankBonusDetailUseCase;

    private final CarRankBonusDetailResponseMapper carRankBonusDetailResponseMapper;
    private final CarRankBonusDetailSearchRequestMapper carRankBonusDetailSearchRequestMapper;

    @GetMapping("/{id}")
    public Mono<ResponseEntity<ApiResponse<CarRankBonusDetailResponse>>> getCarRankBonusDetail(@PathVariable UUID id) {
        return ResponseHandler.generateResponse(
                HttpStatus.OK,
                getCarRankBonusDetailUseCase.getById(id)
                        .map(carRankBonusDetailResponseMapper::toResponse),
                true
        );
    }

    @GetMapping("/search")
    public Mono<ResponseEntity<ApiResponse<PagedData<CarRankBonusDetailResponse>>>> searchCarRankBonusDetails(
            @Valid @ModelAttribute PaginationRequest pagination,
            @Valid @ModelAttribute CarRankBonusDetailSearchRequest criteriaRequest
    ) {
        CarRankBonusDetailSearchCriteria criteria = carRankBonusDetailSearchRequestMapper.toDomain(criteriaRequest);
        Pageable pageable = PageableUtils.createPageable(pagination, "created_at");

        return ResponseHandler.generateResponse(
                HttpStatus.OK,
                searchCarRankBonusDetailUseCase
                        .searchCarRankBonusDetails(criteria, pageable)
                        .map(carRankBonusDetailResponseMapper::toResponse),
                true
        );
    }
}