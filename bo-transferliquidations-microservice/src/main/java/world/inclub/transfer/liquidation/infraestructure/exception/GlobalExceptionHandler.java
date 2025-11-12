package world.inclub.transfer.liquidation.infraestructure.exception;

import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.dao.DataIntegrityViolationException;
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
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.reactive.result.method.annotation.ResponseEntityExceptionHandler;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.UnsupportedMediaTypeStatusException;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.domain.constant.ErrorMessages;
import world.inclub.transfer.liquidation.infraestructure.exception.common.ResourceNotFoundException;
import world.inclub.transfer.liquidation.infraestructure.exception.core.ApiError;
import world.inclub.transfer.liquidation.infraestructure.exception.factory.ErrorResponseFactory;

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
    @SuppressWarnings("null")
    @Override
    protected Mono<ResponseEntity<Object>> handleWebExchangeBindException(
            WebExchangeBindException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            ServerWebExchange exchange
    ) {
        log.error("ConstraintViolationException: {}", ex.getMessage());
        ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST);
        apiError.setMessage(ErrorMessages.VALIDATION_MESSAGE);

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
    @SuppressWarnings("null")
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
        return errorFactory.buildResponseEntity(new ApiError(HttpStatus.BAD_REQUEST, builder.substring(0, builder.length() - 2), ex));
    }

    /**
     * Handle DataIntegrityViolationException, inspects the cause for different DB causes.
     *
     * @param ex the DataIntegrityViolationException
     * @return the ApiError object
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
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
    @SuppressWarnings("null")
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    protected Mono<ResponseEntity<Object>> handleMethodArgumentTypeMismatch(MethodArgumentTypeMismatchException ex,
                                                                      WebRequest request) {
        log.error("Method argument type mismatch: {}", ex.getMessage());
        ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST);
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
    @SuppressWarnings("null")
    @Override
    protected Mono<ResponseEntity<Object>> handleHandlerMethodValidationException(HandlerMethodValidationException ex, HttpHeaders headers, HttpStatusCode status, ServerWebExchange exchange) {
        log.error("HandlerMethodValidationException: {}", ex.getMessage());
        ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST);
        apiError.setMessage(ErrorMessages.VALIDATION_MESSAGE);
        apiError.setDebugMessage(ex.getLocalizedMessage());
        return errorFactory.buildResponseEntityMono(apiError);
    }

    /**
     * Handles EntityNotFoundException.
     * Created to encapsulate errors with more detail than javax.persistence.EntityNotFoundException.
     * @param ex the EntityNotFoundException
     * @return the ErrorResponse object
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Mono<ResponseEntity<Object>> resourceNotFoundException(ResourceNotFoundException ex) {
        log.error("ResourceNotFoundException: {}", ex.getMessage());
        return errorFactory.createErrorResponsMono(HttpStatus.NOT_FOUND, ex);
    }

    @ExceptionHandler(DocumentServiceException.class)
    public Mono<ResponseEntity<Object>> handleDocumentServiceException(DocumentServiceException ex) {
        log.error("DocumentServiceException: {}", ex.getMessage());
        return errorFactory.createErrorResponsMono(HttpStatus.BAD_GATEWAY, ex);
    }
}