package world.inclub.bonusesrewards.carbonus.application.usecase.carquotation;

import reactor.core.publisher.Mono;

import java.util.UUID;

public interface AcceptCarQuotationUseCase {

    /**
     * Accepts a car quotation based on the provided quotation code.
     *
     * @param quotationCode the unique identifier of the car quotation to be accepted
     * @return a Mono signaling completion or error
     */
    Mono<Void> acceptQuotation(UUID quotationCode);

}
