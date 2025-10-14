package world.inclub.bonusesrewards.carbonus.infrastructure.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.application.usecase.carrankbonus.DeleteCarRankBonusUseCase;
import world.inclub.bonusesrewards.carbonus.application.usecase.carrankbonus.GetCarRankBonusByMemberIdUseCase;
import world.inclub.bonusesrewards.carbonus.application.usecase.carrankbonus.SaveCarRankBonusUseCase;
import world.inclub.bonusesrewards.carbonus.application.usecase.carrankbonus.UpdateCarRankBonusUseCase;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.constants.CarBonusApiPaths.RankBonuses;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request.CarRankBonusRequest;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.response.CarRankBonusResponse;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carrankbonus.CarRankBonusRequestMapper;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carrankbonus.CarRankBonusResponseMapper;
import world.inclub.bonusesrewards.shared.response.ApiResponse;
import world.inclub.bonusesrewards.shared.response.ResponseHandler;

import java.util.UUID;

@RestController
@RequestMapping(RankBonuses.BASE)
@RequiredArgsConstructor
public class CarRankBonusController {

    private final SaveCarRankBonusUseCase saveCarRankBonusUseCase;
    private final UpdateCarRankBonusUseCase updateCarRankBonusUseCase;
    private final DeleteCarRankBonusUseCase deleteCarRankBonusUseCase;
    private final GetCarRankBonusByMemberIdUseCase getCarRankBonusByMemberIdUseCase;

    private final CarRankBonusRequestMapper carRankBonusRequestMapper;
    private final CarRankBonusResponseMapper carRankBonusResponseMapper;

    @PostMapping
    public Mono<ResponseEntity<ApiResponse<CarRankBonusResponse>>> create(@Valid @RequestBody CarRankBonusRequest request) {
        return ResponseHandler.generateResponse(
                HttpStatus.CREATED,
                saveCarRankBonusUseCase.save(carRankBonusRequestMapper.toDomain(request))
                        .map(carRankBonusResponseMapper::toResponse),
                true
        );
    }

    @PutMapping("/{id}")
    public Mono<ResponseEntity<ApiResponse<CarRankBonusResponse>>> update(
            @PathVariable UUID id,
            @Valid @RequestBody CarRankBonusRequest request
    ) {
        return ResponseHandler.generateResponse(
                HttpStatus.OK,
                updateCarRankBonusUseCase.update(id, carRankBonusRequestMapper.toDomain(request))
                        .map(carRankBonusResponseMapper::toResponse),
                true
        );
    }

    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<ApiResponse<String>>> delete(@PathVariable UUID id) {
        return ResponseHandler.generateResponse(
                HttpStatus.OK,
                deleteCarRankBonusUseCase.deleteById(id)
                        .thenReturn("Car rank bonus deleted successfully"),
                true
        );
    }

    @GetMapping("/member/{memberId}")
    public Mono<ResponseEntity<ApiResponse<CarRankBonusResponse>>> getByMemberId(@PathVariable Long memberId) {
        return ResponseHandler.generateResponse(
                HttpStatus.OK,
                getCarRankBonusByMemberIdUseCase.getByMemberId(memberId)
                        .map(carRankBonusResponseMapper::toResponse),
                true
        );
    }

}