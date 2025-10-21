package world.inclub.bonusesrewards.carbonus.application.usecase.carquotation.detail;

import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.carbonus.domain.dto.CarQuotationSelected;


public interface GetCarQuotationSelectedUseCase {

    /**
     * Get all car quotation selected with optional filters.
     *
     * @param member     Optional member identifier to filter by member.
     * @param rankId     Optional rank ID to filter by rank.
     * @return A Flux emitting a list of CarQuotationSelected objects.
     */
    Flux<CarQuotationSelected> getAll(
            String member,
            Long rankId
    );

}