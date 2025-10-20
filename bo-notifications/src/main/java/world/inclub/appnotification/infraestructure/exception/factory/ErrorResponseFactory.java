package world.inclub.appnotification.infraestructure.exception.factory;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import world.inclub.appnotification.infraestructure.exception.core.ErrorResponse;


/**
 * andre on 12/02/2024
 */
@Component
public class ErrorResponseFactory {

    public Mono<ResponseEntity<Object>> buildResponseEntityMono(ErrorResponse errorResponse) {
        return Mono.just(new ResponseEntity<>(errorResponse, errorResponse.getStatus()));
    }

    public Mono<ResponseEntity<Object>> createErrorResponsMono(HttpStatus status, Exception ex) {
        ErrorResponse errorResponse = new ErrorResponse(status);
        errorResponse.setTitle(ex.getClass().getSimpleName());
        errorResponse.setMessage(ex.getMessage());
        return buildResponseEntityMono(errorResponse);
    }

    public ResponseEntity<Object> buildResponseEntity(ErrorResponse errorResponse) {
        return new ResponseEntity<>(errorResponse, errorResponse.getStatus());
    }

    public ResponseEntity<Object> createErrorResponse(HttpStatus status, Exception ex) {
        ErrorResponse errorResponse = new ErrorResponse(status);
        errorResponse.setTitle(ex.getClass().getSimpleName());
        errorResponse.setMessage(ex.getMessage());
        return new ResponseEntity<>(errorResponse, errorResponse.getStatus());
    }



}
