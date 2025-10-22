package world.inclub.membershippayment.infraestructure.filter;

import org.springframework.web.reactive.function.client.ClientRequest;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import reactor.core.publisher.Mono;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static world.inclub.membershippayment.crosscutting.utils.ConstantFields.TOKEN_PREFIX;

public interface WebclientInterceptor {

    static ExchangeFilterFunction interceptor(String token) {
        return ExchangeFilterFunction.ofRequestProcessor(request ->
                Mono.just(ClientRequest.from(request)
                        .header(AUTHORIZATION, TOKEN_PREFIX.concat(token)).build()));
    }
}
