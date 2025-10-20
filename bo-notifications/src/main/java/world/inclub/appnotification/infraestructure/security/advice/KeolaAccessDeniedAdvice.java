package world.inclub.appnotification.infraestructure.security.advice;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.server.authorization.ServerAccessDeniedHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import world.inclub.appnotification.infraestructure.security.enumeration.KeolaStatusEnum;
import world.inclub.appnotification.infraestructure.security.utils.impl.AuthFailureHandler;


@RequiredArgsConstructor
@Component
public class KeolaAccessDeniedAdvice implements ServerAccessDeniedHandler {

    final AuthFailureHandler authFailureHandler;

    @Override
    public Mono<Void> handle(ServerWebExchange exchange, AccessDeniedException denied) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.FORBIDDEN);
        return authFailureHandler.formatResponse(KeolaStatusEnum.FORBIDDEN, response);
    }
}
