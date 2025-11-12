package world.inclub.transfer.liquidation.infraestructure.config.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.server.ServerAuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.infraestructure.config.security.handler.AuthFailureHandler;
import world.inclub.transfer.liquidation.infraestructure.exception.core.ApiError;


@Slf4j
@Component
@RequiredArgsConstructor
public class CustomOAuth2AuthenticationEntryPoint implements ServerAuthenticationEntryPoint {

    final AuthFailureHandler authFailureHandler;
    private String realmName;

    @Override
    public Mono<Void> commence(ServerWebExchange exchange, AuthenticationException ex) {
        log.info("CustomOAuth2AuthenticationEntryPoint commence {}", ex.getMessage());

        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.UNAUTHORIZED);

        HttpStatus status = HttpStatus.UNAUTHORIZED;
        String errorMessage = "Insufficient authentication details, No Bearer token found in the request";

        ApiError apiError = new ApiError(status);
        apiError.setTitle(ex.getClass().getSimpleName());
        apiError.setMessage(errorMessage);

        return authFailureHandler.createResponseEntity2(apiError, response);
    }

}
