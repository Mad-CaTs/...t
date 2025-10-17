package world.inclub.bonusesrewards.shared.payment.infrastructure.client.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.infrastructure.webclient.DataResponse;
import world.inclub.bonusesrewards.shared.payment.domain.model.PaymentSubType;
import world.inclub.bonusesrewards.shared.payment.domain.port.PaymentSubTypeRepositoryPort;

@Component
@RequiredArgsConstructor
public class PaymentSubTypeWebClientAdapter implements PaymentSubTypeRepositoryPort {

    @Qualifier("adminWebClient")
    private final WebClient adminWebClient;

    @Override
    public Mono<PaymentSubType> findById(Integer id) {
        return adminWebClient.get()
                .uri("/api/paymentsubtype/{id}", id)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<DataResponse<PaymentSubType>>() {
                })
                .map(DataResponse::data);
    }
}
