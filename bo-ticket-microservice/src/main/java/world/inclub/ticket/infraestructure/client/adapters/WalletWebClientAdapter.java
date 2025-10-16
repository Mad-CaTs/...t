package world.inclub.ticket.infraestructure.client.adapters;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.model.Wallet;
import world.inclub.ticket.domain.ports.WalletRepositoryPort;
import world.inclub.ticket.infraestructure.client.dto.DataResponse;

@Component
@RequiredArgsConstructor
public class WalletWebClientAdapter implements WalletRepositoryPort {

    @Qualifier("walletWebClient")
    private final WebClient walletWebClient;

    @Override
    public Mono<Wallet> getByUserId(Long userId) {
        return walletWebClient.get()
                .uri("/api/v1/wallet/user/{userId}", userId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<DataResponse<Wallet>>() {})
                .map(DataResponse::data);
    }

}
