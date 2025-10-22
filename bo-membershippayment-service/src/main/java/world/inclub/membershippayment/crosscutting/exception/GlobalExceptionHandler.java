package world.inclub.membershippayment.crosscutting.exception;

import io.github.resilience4j.circuitbreaker.CallNotPermittedException;
import lombok.extern.slf4j.Slf4j;
import jakarta.validation.ConstraintViolationException;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.support.WebExchangeBindException;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.reactive.result.method.annotation.ResponseEntityExceptionHandler;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.UnsupportedMediaTypeStatusException;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.crosscutting.exception.common.ResourceNotFoundException;
import world.inclub.membershippayment.crosscutting.exception.constants.ExceptionConstants;
import world.inclub.membershippayment.crosscutting.exception.core.ApiError;
import world.inclub.membershippayment.crosscutting.exception.core.BusinessLogicException;
import world.inclub.membershippayment.crosscutting.exception.core.ExternalApiException;
import world.inclub.membershippayment.crosscutting.exception.factory.ErrorResponseFactory;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

import org.springframework.core.annotation.Order;
import org.springframework.dao.DataIntegrityViolationException;
import world.inclub.membershippayment.domain.Exceptions.DomainValidationException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeoutException;


/**
 * andre on 12/02/2024
 */
@Order(Ordered.HIGHEST_PRECEDENCE)
@Slf4j(topic = "GlobalExceptionHandler")
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    private final ErrorResponseFactory errorFactory;

    public GlobalExceptionHandler(ErrorResponseFactory errorFactory) {
        this.errorFactory = errorFactory;
    }

    /**
     * Handles ConstraintViolationException.
     * @param ex the ConstraintViolationException
     * @param headers the HttpHeaders
     * @param status the HttpStatusCode
     * @param exchange the ServerWebExchange
     * @return the ErrorResponse object
     */
    @Override
    protected Mono<ResponseEntity<Object>> handleWebExchangeBindException(
            WebExchangeBindException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            ServerWebExchange exchange
    ) {
        log.error("ConstraintViolationException: {}", ex.getMessage());
        ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST);
        apiError.setMessage(ExceptionConstants.ErrorMessages.VALIDATION_MESSAGE);

        // Pass all errors to the ErrorResponse object
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            apiError.addValidationError(fieldName, errorMessage);
        });
        return errorFactory.buildResponseEntityMono(apiError);
    }

    /**
     * Handles UnsupportedMediaTypeStatusException. This one triggers when the request content type is not supported.
     * @param ex the UnsupportedMediaTypeStatusException
     * @param headers the HttpHeaders
     * @param status the HttpStatusCode
     * @param exchange the ServerWebExchange
     * @return the ErrorResponse object
     */
    @Override
    protected Mono<ResponseEntity<Object>> handleUnsupportedMediaTypeStatusException(
            UnsupportedMediaTypeStatusException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            ServerWebExchange exchange) {
        log.info("UnsupportedMediaTypeStatusException: {}", ex.getMessage());
        StringBuilder builder = new StringBuilder();
        builder.append(ex.getContentType());
        builder.append(" media type is not supported. Supported media types are ");
        // Return a list of supported media types
        ex.getSupportedMediaTypes().forEach(t -> builder.append(t).append(", "));
        return errorFactory.buildResponseEntity(new ApiError(BAD_REQUEST, builder.substring(0, builder.length() - 2), ex));
    }

    /**
     * Handle DataIntegrityViolationException, inspects the cause for different DB causes.
     *
     * @param ex the DataIntegrityViolationException
     * @return the ApiError object
     */
    protected Mono<ResponseEntity<Object>> handleDataIntegrityViolationException(DataIntegrityViolationException ex, WebRequest request) {
        if (ex.getCause() instanceof ConstraintViolationException) {
            return errorFactory.buildResponseEntity(new ApiError(HttpStatus.CONFLICT, "Database error", ex.getCause()));
        }
        return errorFactory.buildResponseEntity(new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, ex));
    }

    /**
     * Handle Exception, handle generic Exception.class
     *
     * @param ex the Exception
     * @return the ApiError object
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    protected Mono<ResponseEntity<Object>> handleMethodArgumentTypeMismatch(MethodArgumentTypeMismatchException ex,
                                                                      WebRequest request) {
        log.error("Method argument type mismatch: {}", ex.getMessage());
        ApiError apiError = new ApiError(BAD_REQUEST);
        apiError.setMessage(String.format("The parameter '%s' of value '%s' could not be converted to type '%s'", ex.getName(), ex.getValue(), ex.getRequiredType().getSimpleName()));
        apiError.setDebugMessage(ex.getMessage());
        return errorFactory.buildResponseEntity(apiError);
    }


    /**
     * Handles HandlerMethodValidationException. This one triggers when @Validated fails.
     * @param ex
     * @param headers
     * @param status
     * @param exchange
     * @return
     */
    @Override
    protected Mono<ResponseEntity<Object>> handleHandlerMethodValidationException(HandlerMethodValidationException ex, HttpHeaders headers, HttpStatusCode status, ServerWebExchange exchange) {
        log.error("HandlerMethodValidationException: {}", ex.getMessage());
        ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST);
        apiError.setMessage(ExceptionConstants.ErrorMessages.VALIDATION_MESSAGE);
        apiError.setDebugMessage(ex.getLocalizedMessage());
        return errorFactory.buildResponseEntityMono(apiError);
    }

    /**
     * Handles EntityNotFoundException.
     * Created to encapsulate errors with more detail than javax.persistence.EntityNotFoundException.
     * @param ex the EntityNotFoundException
     * @return the ErrorResponse object
     */
    @ExceptionHandler(value = {ResourceNotFoundException.class})
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Mono<ResponseEntity<Object>> resourceNotFoundException(ResourceNotFoundException ex) {
        log.error("ResourceNotFoundException: {}", ex.getMessage());
        return errorFactory.createErrorResponsMono(HttpStatus.NOT_FOUND, ex);
    }


    //Nueva Exception
    @ExceptionHandler(ExternalApiException.class)
    @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
    public Mono<ResponseEntity<Object>> handleExternalApiException(ExternalApiException ex) {
        ApiError apiError = new ApiError(HttpStatus.SERVICE_UNAVAILABLE, ex.getMessage(), ex);
        apiError.setDebugMessage(ex.getDetails());
        return errorFactory.buildResponseEntityMono(apiError);
    }

    // Manejo de CallNotPermittedException cuando el Circuit Breaker está abierto
    @ExceptionHandler(CallNotPermittedException.class)
    @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)  // 503 Service Unavailable
    public Mono<ResponseEntity<Object>> handleCallNotPermittedException(CallNotPermittedException ex) {
        log.error("Circuit Breaker is OPEN: {}", ex.getMessage());

        ApiError apiError = new ApiError(HttpStatus.SERVICE_UNAVAILABLE);
        apiError.setMessage("Circuit Breaker is open. Please try again later.");
        apiError.setDebugMessage(ex.getMessage());

        return errorFactory.buildResponseEntityMono(apiError);
    }


    //Pendiente
    // Manejo de BulkheadException cuando los recursos están agotados
/*
    @ExceptionHandler(BulkheadException.class)
    @ResponseStatus(HttpStatus.TOO_MANY_REQUESTS)  // 429 Too Many Requests
    public Mono<ResponseEntity<Object>> handleBulkheadException(BulkheadException ex) {
        log.error("Bulkhead is full: {}", ex.getMessage());

        ApiError apiError = new ApiError(HttpStatus.TOO_MANY_REQUESTS);
        apiError.setMessage("The system is under heavy load. Please try again later.");
        apiError.setDebugMessage(ex.getMessage());

        return errorFactory.buildResponseEntityMono(apiError);
    }

*/
    // Manejador para TimeoutException
    @ExceptionHandler(TimeoutException.class)
    @ResponseStatus(HttpStatus.GATEWAY_TIMEOUT) // 504 Gateway Timeout
    public Mono<ResponseEntity<Object>> handleTimeoutException(TimeoutException ex) {
        log.error("TimeoutException: Request took too long to process: {}", ex.getMessage());

        ApiError apiError = new ApiError(HttpStatus.GATEWAY_TIMEOUT);
        apiError.setMessage("The request took too long to process. Please try again later.");
        apiError.setDebugMessage(ex.getMessage());

        return errorFactory.buildResponseEntityMono(apiError);
    }

    //Manejado de Errores para lógica de Negocio
    @ExceptionHandler(BusinessLogicException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public Mono<ResponseEntity<Object>> handleBusinessLogicException(BusinessLogicException ex) {
        log.error("BusinessLogicException: {}", ex.getMessage());

        ApiError apiError = new ApiError(HttpStatus.CONFLICT, ex.getMessage(), ex);
        apiError.setDebugMessage(ex.getDetails());  // Usamos los detalles adicionales si están disponibles
        return errorFactory.buildResponseEntityMono(apiError);
    }

    @ExceptionHandler(DomainValidationException.class)
    public Mono<ResponseEntity<Object>> handleDomainValidation(DomainValidationException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Bad Request");
        body.put("message", ex.getMessage());

        return Mono.just(ResponseEntity.badRequest().body(body));
    }

    @ExceptionHandler(Exception.class)
    public Mono<ResponseEntity<Object>> handleGeneric(Exception ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        body.put("error", "Internal Server Error");
        body.put("message", ex.getMessage());

        return Mono.just(ResponseEntity.internalServerError().body(body));
    }


}
