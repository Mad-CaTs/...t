package world.inclub.ticket.infraestructure.client.adapters;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.model.Member;
import world.inclub.ticket.domain.ports.MemberRepositoryPort;

@Component
@RequiredArgsConstructor
public class MemberWebClientAdapter implements MemberRepositoryPort {

    @Qualifier("adminWebClient")
    private final WebClient adminWebClient;

    @Override
    public Mono<Member> getMemberByIdUser(Long userId) {
        return adminWebClient.get()
            .uri("/api/user/{userId}", userId)
            .retrieve()
            .bodyToMono(new ParameterizedTypeReference<Member>() {})
            .onErrorResume(throwable -> Mono.empty());
    }
}
