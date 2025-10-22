package world.inclub.membershippayment.crosscutting.exception.security.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.crosscutting.exception.core.ApiError;

import java.time.LocalDateTime;

@Component
public class AuthFailureHandler {

    final ObjectMapper objectMapper;

    public AuthFailureHandler() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }


    public Mono<Void> createResponseEntity2(ApiError apiError, ServerHttpResponse response) {
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);
        apiError.setTimestamp(LocalDateTime.now());
        try {
            String apiErrorJson = objectMapper.writeValueAsString(apiError);
            return response.writeWith(Mono.just(response.bufferFactory().wrap(apiErrorJson.getBytes())));
        } catch (Exception e) {
            throw new RuntimeException("Error while processing JSON", e);
        }
    }

}
