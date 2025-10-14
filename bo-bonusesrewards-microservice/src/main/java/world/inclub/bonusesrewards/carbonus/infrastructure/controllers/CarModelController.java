package world.inclub.bonusesrewards.carbonus.infrastructure.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request.CarModelRequest;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.response.CarModelResponse;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carmodel.CarModelRequestMapper;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carmodel.CarModelResponseMapper;
import world.inclub.bonusesrewards.carbonus.application.usecase.carmodel.*;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.constants.CarBonusApiPaths.Models;
import world.inclub.bonusesrewards.shared.response.ApiResponse;
import world.inclub.bonusesrewards.shared.response.ResponseHandler;

import java.util.List;

@RestController
@RequestMapping(Models.BASE)
@RequiredArgsConstructor
public class CarModelController {

    private final GetAllCarModelsUseCase getAllCarModelsUseCase;
    private final GetCarModelByBrandIdAndNameUseCase findCarModelByBrandIdAndNameUseCase;
    private final SaveCarModelUseCase saveCarModelUseCase;
    private final UpdateCarModelUseCase updateCarModelUseCase;
    private final DeleteCarModelByIdUseCase deleteCarModelByIdUseCase;

    private final CarModelRequestMapper carModelRequestMapper;
    private final CarModelResponseMapper carModelResponseMapper;

    @GetMapping
    public Mono<ResponseEntity<ApiResponse<List<CarModelResponse>>>> getAll() {
        return ResponseHandler.generateResponse(
                HttpStatus.OK,
                getAllCarModelsUseCase.getAllCarModels()
                        .map(carModelResponseMapper::toResponse)
                        .collectList(),
                true
        );
    }

    @GetMapping("/search")
    public Mono<ResponseEntity<ApiResponse<List<CarModelResponse>>>> getByBrandIdAndName(
            @RequestParam Long brandId,
            @RequestParam String name
    ) {
        return ResponseHandler.generateResponse(
                HttpStatus.OK,
                findCarModelByBrandIdAndNameUseCase.getCarModelByBrandIdAndName(brandId, name)
                        .map(carModelResponseMapper::toResponse)
                        .collectList(),
                true
        );
    }

    @PostMapping
    public Mono<ResponseEntity<ApiResponse<CarModelResponse>>> create(@Valid @RequestBody CarModelRequest request) {
        return ResponseHandler.generateResponse(
                HttpStatus.CREATED,
                saveCarModelUseCase.saveCarModel(carModelRequestMapper.toDomain(request))
                        .map(carModelResponseMapper::toResponse),
                true
        );
    }

    @PutMapping("/{id}")
    public Mono<ResponseEntity<ApiResponse<CarModelResponse>>> update(
            @PathVariable Long id,
            @Valid @RequestBody CarModelRequest request
    ) {
        return ResponseHandler.generateResponse(
                HttpStatus.OK,
                updateCarModelUseCase.updateCarModel(id, carModelRequestMapper.toDomain(request))
                        .map(carModelResponseMapper::toResponse),
                true
        );
    }

    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<ApiResponse<String>>> delete(@PathVariable Long id) {
        return ResponseHandler.generateResponse(
                HttpStatus.OK,
                deleteCarModelByIdUseCase.deleteCarModelById(id)
                        .thenReturn("Car model deleted successfully"),
                true
        );
    }

}
