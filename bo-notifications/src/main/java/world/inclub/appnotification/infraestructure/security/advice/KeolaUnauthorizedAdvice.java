package world.inclub.appnotification.infraestructure.security.advice;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.server.ServerAuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import world.inclub.appnotification.infraestructure.security.enumeration.KeolaStatusEnum;
import world.inclub.appnotification.infraestructure.security.utils.impl.AuthFailureHandler;


@RequiredArgsConstructor
@Component
public class KeolaUnauthorizedAdvice implements ServerAuthenticationEntryPoint {

    final AuthFailureHandler authFailureHandler;

    @Override
    public Mono<Void> commence(ServerWebExchange exchange, AuthenticationException ex) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        return authFailureHandler.formatResponse(KeolaStatusEnum.FORBIDDEN, response);
    }

}
