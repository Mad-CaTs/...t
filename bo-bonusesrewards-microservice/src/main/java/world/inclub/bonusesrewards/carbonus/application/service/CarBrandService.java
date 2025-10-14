package world.inclub.bonusesrewards.carbonus.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.application.usecase.carbrand.*;
import world.inclub.bonusesrewards.carbonus.domain.model.CarBrand;
import world.inclub.bonusesrewards.carbonus.domain.port.CarBrandRepositoryPort;
import world.inclub.bonusesrewards.shared.exceptions.EntityNotFoundException;

@Service
@RequiredArgsConstructor
public class CarBrandService implements 
        GetAllCarBrandsUseCase,
        SaveCarBrandUseCase,
        DeleteCarBrandByIdUseCase,
        GetCarBrandByNameUseCase,
        UpdateCarBrandUseCase {

    private final CarBrandRepositoryPort repository;

    @Override
    public Flux<CarBrand> getAllCarBrands() {
        return repository.findAll()
                .switchIfEmpty(Mono.error(new EntityNotFoundException("No carassignment brands found")));
    }

    @Override
    public Mono<CarBrand> saveCarBrand(CarBrand carBrand) {
        return repository.save(carBrand);
    }

    @Override
    public Mono<Void> deleteCarBrandById(Long id) {
        return repository.findById(id)
                .switchIfEmpty(Mono.error(new EntityNotFoundException("CarBrand not found with id: " + id)))
                .flatMap(existing -> repository.deleteById(id));
    }

    @Override
    public Flux<CarBrand> getCarBrandByName(String name) {
        return repository.findByName(name)
                .switchIfEmpty(Mono.error(new EntityNotFoundException("No CarBrands found with name: " + name)));
    }

    @Override
    public Mono<CarBrand> updateCarBrand(Long id, CarBrand carBrand) {
        return repository.findById(id)
                .switchIfEmpty(Mono.error(new EntityNotFoundException("CarBrand not found with id: " + id)))
                .flatMap(existingCarBrand -> {
                    CarBrand updatedCarBrand = carBrand.toBuilder()
                            .id(existingCarBrand.id())
                            .build();
                    return repository.save(updatedCarBrand);
                });
    }

}
