package world.inclub.bonusesrewards.carbonus.infrastructure.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.application.usecase.carassignment.*;
import world.inclub.bonusesrewards.carbonus.domain.model.CarAssignment;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.request.CarAssignmentRequest;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carassignment.CarAssigmentRequestMapper;
import world.inclub.bonusesrewards.carbonus.domain.model.Car;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.constants.CarBonusApiPaths.CarsAssignments;
import world.inclub.bonusesrewards.shared.utils.filestorage.infrastructure.FilePartAdapter;
import world.inclub.bonusesrewards.shared.response.ApiResponse;
import world.inclub.bonusesrewards.shared.response.ResponseHandler;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping(CarsAssignments.BASE)
public class CarAssignmentController {

    private final SaveCarAssigmentUseCase saveCarAssigmentUseCase;
    private final UpdateCarAssigmentUseCase updateCarAssigmentUseCase;
    private final DeleteCarAssigmentByIdUseCase deleteCarAssigmentByIdUseCase;

    private final CarAssigmentRequestMapper carAssigmentRequestMapper;
    private final FilePartAdapter filePartAdapter;

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Mono<ResponseEntity<ApiResponse<String>>> create(@Valid @ModelAttribute CarAssignmentRequest request) {
        Car car = carAssigmentRequestMapper.toDomainCar(request);
        CarAssignment carAssignment = carAssigmentRequestMapper.toDomainAssignment(request);
        Mono<Void> mono = request.car().image() == null
                ? saveCarAssigmentUseCase.saveCarAssignment(car, carAssignment, null)
                : filePartAdapter.from(request.car().image())
                .flatMap(fileResource -> saveCarAssigmentUseCase
                        .saveCarAssignment(car, carAssignment, fileResource));
        return ResponseHandler
                .generateResponse(HttpStatus.OK, mono.thenReturn("Car assignment created successfully"), true);
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Mono<ResponseEntity<ApiResponse<String>>> update(
            @PathVariable UUID id,
            @Valid @ModelAttribute CarAssignmentRequest request
    ) {
        Car car = carAssigmentRequestMapper.toDomainCar(request);
        CarAssignment carAssignment = carAssigmentRequestMapper.toDomainAssignment(request);
        Mono<Void> mono = request.car().image() == null
                ? updateCarAssigmentUseCase.updateCarAssigment(id, car, carAssignment, null)
                : filePartAdapter.from(request.car().image())
                .flatMap(fileResource -> updateCarAssigmentUseCase
                        .updateCarAssigment(id, car, carAssignment, fileResource));
        return ResponseHandler
                .generateResponse(HttpStatus.OK, mono.thenReturn("Car assignment updated successfully"), true);
    }

    @DeleteMapping("/delete/{id}")
    public Mono<ResponseEntity<ApiResponse<String>>> delete(@PathVariable UUID id) {
        return ResponseHandler.generateResponse(HttpStatus.OK, deleteCarAssigmentByIdUseCase.deleteById(id)
                .thenReturn("Car deleted successfully"), true);
    }
}