package world.inclub.appnotification.infraestructure.security.advice;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.boot.web.reactive.error.ErrorWebExceptionHandler;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import world.inclub.appnotification.infraestructure.security.enumeration.KeolaStatusEnum;
import world.inclub.appnotification.infraestructure.security.utils.impl.AuthFailureHandler;


@RequiredArgsConstructor
@Log4j2
@Component
public class KeolaTokenJwtExceptionAdvice implements ErrorWebExceptionHandler {

    final AuthFailureHandler authFailureHandler;

    @Override
    public Mono<Void> handle(ServerWebExchange exchange, Throwable e) {
        log.error(e.getMessage(), e);
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.FORBIDDEN);
        return authFailureHandler.formatResponse(KeolaStatusEnum.FORBIDDEN, response);
    }

}
