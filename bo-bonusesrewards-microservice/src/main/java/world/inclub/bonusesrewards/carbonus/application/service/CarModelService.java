package world.inclub.bonusesrewards.carbonus.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.application.usecase.carmodel.*;
import world.inclub.bonusesrewards.carbonus.domain.model.CarModel;
import world.inclub.bonusesrewards.carbonus.domain.port.CarBrandRepositoryPort;
import world.inclub.bonusesrewards.carbonus.domain.port.CarModelRepositoryPort;
import world.inclub.bonusesrewards.shared.exceptions.EntityNotFoundException;

@Service
@RequiredArgsConstructor
public class CarModelService
        implements
        GetAllCarModelsUseCase,
        GetCarModelByBrandIdAndNameUseCase,
        SaveCarModelUseCase,
        DeleteCarModelByIdUseCase,
        UpdateCarModelUseCase {

    private final CarModelRepositoryPort carModelRepositoryPort;
    private final CarBrandRepositoryPort carBrandRepositoryPort;

    @Override
    public Flux<CarModel> getAllCarModels() {
        return carModelRepositoryPort.findAll()
                .switchIfEmpty(Mono.error(new EntityNotFoundException("No CarModels found")));
    }

    @Override
    public Flux<CarModel> getCarModelByBrandIdAndName(Long brandId, String name) {
        return carModelRepositoryPort.findByBrandIdAndName(brandId, name)
                .switchIfEmpty(Mono.error(new EntityNotFoundException("No CarModels found with brandId: " + brandId + " and name: " + name)));
    }

    @Override
    public Mono<CarModel> saveCarModel(CarModel carModel) {
        return carModelRepositoryPort.save(carModel);
    }

    @Override
    public Mono<Void> deleteCarModelById(Long id) {
        return carModelRepositoryPort.findById(id)
                .switchIfEmpty(Mono.error(new EntityNotFoundException("CarModel not found with id: " + id)))
                .flatMap(existing -> carModelRepositoryPort.deleteById(id));
    }

    @Override
    public Mono<CarModel> updateCarModel(Long id, CarModel carModel) {
        return carModelRepositoryPort.findById(id)
                .switchIfEmpty(Mono.error(new EntityNotFoundException("CarModel not found with id: " + id)))
                .flatMap(existingCarModel -> carBrandRepositoryPort.findById(carModel.brandId())
                        .switchIfEmpty(Mono.error(new EntityNotFoundException("CarBrand not found with id: " + carModel.brandId())))
                        .then(Mono.defer(() -> {
                            CarModel updatedCarModel = carModel.toBuilder()
                                    .id(existingCarModel.id())
                                    .build();
                            return carModelRepositoryPort.save(updatedCarModel);
                        })));
    }

}
