package world.inclub.bonusesrewards.shared.exceptions;

import io.r2dbc.spi.R2dbcException;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.r2dbc.connection.ConnectionFactoryUtils;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.support.WebExchangeBindException;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.ServerWebInputException;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({
            NotFoundException.class,
            EntityNotFoundException.class,
    })
    public Mono<ResponseEntity<ErrorDetails>> notFound(Exception ex, ServerWebExchange exchange) {
        ErrorDetails errorDetails = new ErrorDetails(
                ex.getMessage(),
                exchange.getRequest().getPath().value(),
                LocalDateTime.now().toString(),
                HttpStatus.NOT_FOUND.value()
        );
        return Mono.just(ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorDetails));
    }

    @ExceptionHandler({ServerWebInputException.class})
    public Mono<ResponseEntity<ErrorDetails>> handleTypeMismatch(
            ServerWebInputException ex,
            ServerWebExchange exchange
    ) {
        Throwable rootCause = ex.getRootCause();
        Map<String, Object> errorBody = new HashMap<>();

        if (rootCause != null && rootCause.getMessage() != null) {
            String message = rootCause.getMessage();

            Pattern pattern = Pattern.compile("Cannot deserialize value of type `([^`]*)` from String \"([^\"]*)\"");
            Matcher matcher = pattern.matcher(message);

            if (matcher.find()) {
                errorBody.put("expected", matcher.group(1));
                errorBody.put("rejectedValue", matcher.group(2));
                errorBody.put("message", "Invalid input format");
            } else {
                errorBody.put("message", "Invalid input format: " + message.split("\n")[0]);
            }
        } else {
            errorBody.put("message", "Invalid input format.");
        }


        ErrorDetails errorDetails = new ErrorDetails(
                errorBody,
                exchange.getRequest().getPath().value(),
                LocalDateTime.now().toString(),
                HttpStatus.BAD_REQUEST.value()
        );
        return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorDetails));
    }

    @ExceptionHandler({WebExchangeBindException.class})
    public Mono<ResponseEntity<ErrorDetails>> handleValidationException(
            WebExchangeBindException ex,
            ServerWebExchange exchange
    ) {
        List<Map<String, String>> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(fieldError -> Map.of(
                        "field",
                        fieldError.getField(),
                        "message",
                        fieldError.getDefaultMessage() != null ? fieldError.getDefaultMessage() : "Unknown error"
                ))
                .toList();

        ErrorDetails errorDetails = new ErrorDetails(
                errors,
                exchange.getRequest().getPath().value(),
                LocalDateTime.now().toString(),
                HttpStatus.BAD_REQUEST.value()
        );
        return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorDetails));
    }

    @ExceptionHandler({DataIntegrityViolationException.class})
    public Mono<ResponseEntity<ErrorDetails>> handleDataIntegrityViolationException(
            DataIntegrityViolationException ex,
            ServerWebExchange exchange
    ) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        String message = "Data integrity violation";

        if (ex.getRootCause() != null && ex.getRootCause().getMessage() != null) {
            String rootMsg = ex.getRootCause().getMessage().toLowerCase();

            if (rootMsg.contains("unique") || rootMsg.contains("duplicate")) {
                status = HttpStatus.CONFLICT;
                message = "Resource already exists";
            } else if (rootMsg.contains("foreign key")) {
                if (rootMsg.contains("violates foreign key constraint")) {
                    if (rootMsg.contains("insert") || rootMsg.contains("update")) {
                        message = "Referenced entity does not exist";
                    } else if (rootMsg.contains("delete")) {
                        status = HttpStatus.CONFLICT;
                        message = "Resource is referenced by another entity";
                    }
                }
            } else {
                message = ex.getRootCause().getMessage();
            }
        }

        ErrorDetails errorDetails = new ErrorDetails(
                message,
                exchange.getRequest().getPath().value(),
                LocalDateTime.now().toString(),
                status.value()
        );

        return Mono.just(ResponseEntity.status(status).body(errorDetails));
    }

    @ExceptionHandler({
            RequiredFieldException.class,
            InvalidStatusException.class,
    })
    public Mono<ResponseEntity<ErrorDetails>> hangleBadRequest(Exception ex, ServerWebExchange exchange) {
        ErrorDetails errorDetails = new ErrorDetails(
                ex.getMessage(),
                exchange.getRequest().getPath().value(),
                LocalDateTime.now().toString(),
                HttpStatus.BAD_REQUEST.value()
        );
        return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorDetails));
    }

    @ExceptionHandler({
            BusinessRuleException.class,
    })
    public Mono<ResponseEntity<ErrorDetails>> handleUnprocessableEntity(Exception ex, ServerWebExchange exchange) {
        ErrorDetails errorDetails = new ErrorDetails(
                ex.getMessage(),
                exchange.getRequest().getPath().value(),
                LocalDateTime.now().toString(),
                HttpStatus.UNPROCESSABLE_ENTITY.value()
        );
        return Mono.just(ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(errorDetails));
    }

    @ExceptionHandler({
            DataAccessResourceFailureException.class,
            R2dbcException.class
    })
    public Mono<ResponseEntity<ErrorDetails>> handleDatabaseConnectionError(
            Exception ex,
            ServerWebExchange exchange
    ) {
        ErrorDetails errorDetails = new ErrorDetails(
                "Database connection failed",
                exchange.getRequest().getPath().value(),
                LocalDateTime.now().toString(),
                HttpStatus.SERVICE_UNAVAILABLE.value()
        );

        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(errorDetails));
    }

    @ExceptionHandler(Exception.class)
    public Mono<ResponseEntity<ErrorDetails>> handleGlobalException(
            Exception ex,
            ServerWebExchange exchange
    ) {
        ErrorDetails errorDetails = new ErrorDetails(
                ex.getMessage(),
                exchange.getRequest().getPath().value(),
                LocalDateTime.now().toString(),
                HttpStatus.INTERNAL_SERVER_ERROR.value()
        );

        return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorDetails));
    }

    @ExceptionHandler(BadRequestException.class)
    public Mono<ResponseEntity<ErrorDetails>> handleBadRequestException(BadRequestException ex, ServerWebExchange exchange) {
        ErrorDetails errorDetails = new ErrorDetails(
                ex.getMessage(),
                exchange.getRequest().getPath().value(),
                LocalDateTime.now().toString(),
                HttpStatus.BAD_REQUEST.value()
        );
        return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorDetails));
    }

    @ExceptionHandler(AmountException.class)
    public Mono<ResponseEntity<ErrorDetails>> handleAmountException(AmountException ex, ServerWebExchange exchange) {
        ErrorDetails errorDetails = new ErrorDetails(
                ex.getMessage(),
                exchange.getRequest().getPath().value(),
                LocalDateTime.now().toString(),
                HttpStatus.CONFLICT.value()
        );
        return Mono.just(ResponseEntity.status(HttpStatus.CONFLICT).body(errorDetails));
    }

    @ExceptionHandler(InternalServerErrorException.class)
    public Mono<ResponseEntity<ErrorDetails>> handleInternalError(InternalServerErrorException ex) {
        ErrorDetails errorDetails = new ErrorDetails(
                ex.getMessage(),
                "Internal Server Error",
                LocalDateTime.now().toString(),
                HttpStatus.INTERNAL_SERVER_ERROR.value()
        );
        return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorDetails));
    }
}
