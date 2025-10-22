package world.inclub.membershippayment.crosscutting.exception.factory;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.crosscutting.exception.core.ApiError;


@Component
public class ErrorResponseFactory {

    public Mono<ResponseEntity<Object>> buildResponseEntityMono(ApiError apiError) {
        return Mono.just(new ResponseEntity<>(apiError, apiError.getStatus()));
    }

    public Mono<ResponseEntity<Object>> createErrorResponsMono(HttpStatus status, Exception ex) {
        ApiError apiError = new ApiError(status);
        apiError.setTitle(ex.getClass().getSimpleName());
        apiError.setMessage(ex.getMessage());
        return buildResponseEntityMono(apiError);
    }

    public Mono<ResponseEntity<Object>> buildResponseEntity(ApiError apiError) {
        return Mono.just(new ResponseEntity<>(apiError, apiError.getStatus()));
    }

    public ResponseEntity<Object> createErrorResponse(HttpStatus status, Exception ex) {
        ApiError apiError = new ApiError(status);
        apiError.setTitle(ex.getClass().getSimpleName());
        apiError.setMessage(ex.getMessage());
        return new ResponseEntity<>(apiError, apiError.getStatus());
    }



}