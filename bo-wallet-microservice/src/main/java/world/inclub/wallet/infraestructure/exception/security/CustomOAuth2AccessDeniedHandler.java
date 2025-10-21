package world.inclub.wallet.infraestructure.exception.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.server.authorization.ServerAccessDeniedHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import world.inclub.wallet.infraestructure.exception.core.ApiError;
import world.inclub.wallet.infraestructure.exception.security.handler.AuthFailureHandler;


@Slf4j
@Component
@RequiredArgsConstructor
public class CustomOAuth2AccessDeniedHandler implements ServerAccessDeniedHandler {

    final AuthFailureHandler authFailureHandler;

    @Override
    public Mono<Void> handle(ServerWebExchange exchange, AccessDeniedException denied) {
        log.info("CustomOAuth2AccessDeniedHandler commence {}", denied.getMessage());

        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.FORBIDDEN);

        HttpStatus httpStatus = HttpStatus.FORBIDDEN;
        String errorMessage = "Access Denied, The Bearer token has expired, please refresh the token";

        ApiError apiError = new ApiError(httpStatus);
        apiError.setTitle(exchange.getRequest().getPath().value());
        apiError.setMessage(errorMessage);

        return authFailureHandler.createResponseEntity2(apiError, response);
    }
}
