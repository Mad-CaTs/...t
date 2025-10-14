package world.inclub.bonusesrewards.carbonus.infrastructure.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.response.CarBrandResponse;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request.CarBrandRequest;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carbrand.CarBrandRequestMapper;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carbrand.CarBrandResponseMapper;
import world.inclub.bonusesrewards.carbonus.application.usecase.carbrand.*;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.constants.CarBonusApiPaths.Brands;
import world.inclub.bonusesrewards.shared.response.ApiResponse;
import world.inclub.bonusesrewards.shared.response.ResponseHandler;

import java.util.List;

@RestController
@RequestMapping(Brands.BASE)
@RequiredArgsConstructor
public class CarBrandController {

    private final GetAllCarBrandsUseCase getAllCarBrandsUseCase;
    private final GetCarBrandByNameUseCase getCarBrandByNameUseCase;
    private final SaveCarBrandUseCase saveCarBrandUseCase;
    private final UpdateCarBrandUseCase updateCarBrandUseCase;
    private final DeleteCarBrandByIdUseCase deleteCarBrandByIdUseCase;

    private final CarBrandRequestMapper carBrandRequestMapper;
    private final CarBrandResponseMapper carBrandResponseMapper;

    @GetMapping
    public Mono<ResponseEntity<ApiResponse<List<CarBrandResponse>>>> getAll() {
        return ResponseHandler.generateResponse(
                HttpStatus.OK,
                getAllCarBrandsUseCase.getAllCarBrands()
                        .map(carBrandResponseMapper::toResponse),
                true
        );
    }

    @GetMapping("/search")
    public Mono<ResponseEntity<ApiResponse<List<CarBrandResponse>>>> searchByName(@RequestParam String name) {
        return ResponseHandler.generateResponse(
                HttpStatus.OK,
                getCarBrandByNameUseCase.getCarBrandByName(name)
                        .map(carBrandResponseMapper::toResponse),
                true
        );
    }

    @PostMapping
    public Mono<ResponseEntity<ApiResponse<CarBrandResponse>>> create(@Valid @RequestBody CarBrandRequest request) {
        return ResponseHandler.generateResponse(
                HttpStatus.CREATED,
                saveCarBrandUseCase.saveCarBrand(carBrandRequestMapper.toDomain(request))
                        .map(carBrandResponseMapper::toResponse),
                true
        );
    }

    @PutMapping("/{id}")
    public Mono<ResponseEntity<ApiResponse<CarBrandResponse>>> update(
            @PathVariable Long id,
            @Valid @RequestBody CarBrandRequest request
    ) {
        return ResponseHandler.generateResponse(
                HttpStatus.OK,
                updateCarBrandUseCase.updateCarBrand(id, carBrandRequestMapper.toDomain(request))
                        .map(carBrandResponseMapper::toResponse),
                true
        );
    }

    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<ApiResponse<String>>> delete(@PathVariable Long id) {
        return ResponseHandler.generateResponse(
                HttpStatus.OK,
                deleteCarBrandByIdUseCase.deleteCarBrandById(id)
                        .thenReturn("Car brand deleted successfully"),
                true
        );
    }

}
