package world.inclub.bonusesrewards.carbonus.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.carbonus.application.usecase.carquotation.detail.GetCarQuotationDetailByClassificationIdUseCase;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarQuotationDetail;
import world.inclub.bonusesrewards.carbonus.domain.port.CarQuotationDetailRepositoryPort;
import world.inclub.bonusesrewards.shared.exceptions.EntityNotFoundException;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CarQuotationDetailService
        implements GetCarQuotationDetailByClassificationIdUseCase {

    private final CarQuotationDetailRepositoryPort carQuotationDetailRepositoryPort;

    @Override
    public Flux<CarQuotationDetail> getByClassificationId(UUID classificationId) {
        return carQuotationDetailRepositoryPort.findByClassificationId(classificationId)
                .switchIfEmpty(Flux.error(new EntityNotFoundException(
                        "Quotation details not found for classification id: " + classificationId)));
    }

}
