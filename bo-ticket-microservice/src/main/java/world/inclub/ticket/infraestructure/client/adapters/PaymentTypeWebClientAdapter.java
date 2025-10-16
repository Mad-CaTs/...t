package world.inclub.ticket.infraestructure.client.adapters;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import world.inclub.ticket.domain.model.payment.PaymentType;
import world.inclub.ticket.domain.ports.payment.PaymentTypeRepositoryPort;
import world.inclub.ticket.infraestructure.client.dto.DataResponse;

import java.util.List;

@Component
@RequiredArgsConstructor
public class PaymentTypeWebClientAdapter implements PaymentTypeRepositoryPort {

    @Qualifier("adminWebClient")
    private final WebClient adminWebClient;

    @Override
    public Flux<PaymentType> findAllPaymentTypes() {
        return adminWebClient.get()
                .uri("/api/paymenttype/")
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<DataResponse<List<PaymentType>>>() {
                })
                .flatMapMany(response -> Flux.fromIterable(response.data()));
    }
}
