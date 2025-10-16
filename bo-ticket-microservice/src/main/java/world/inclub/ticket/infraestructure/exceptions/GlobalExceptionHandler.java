package world.inclub.ticket.infraestructure.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.support.WebExchangeBindException;
import org.springframework.web.reactive.function.server.ServerResponse;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.ServerWebInputException;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    public Mono<ResponseEntity<ErrorDetails>> handleNotFoundException(NotFoundException ex) {
        ErrorDetails errorDetails = new ErrorDetails(LocalDateTime.now(), ex.getMessage(), "Not Found", "NOT_FOUND");
        return Mono.just(ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorDetails));
    }

    @ExceptionHandler(BadRequestException.class)
    public Mono<ResponseEntity<ErrorDetails>> handleBadRequestException(BadRequestException ex, ServerWebExchange exchange) {
        ErrorDetails errorDetails = new ErrorDetails(LocalDateTime.now(), ex.getMessage(), exchange.getRequest().getPath().toString(), "BAD_REQUEST");
        return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorDetails));
    }

    @ExceptionHandler(AmountException.class)
    public Mono<ResponseEntity<ErrorDetails>> handleAmountException(AmountException ex, ServerWebExchange exchange) {
        ErrorDetails errorDetails = new ErrorDetails(LocalDateTime.now(), ex.getMessage(), exchange.getRequest().getPath().toString(), "AMOUNT_ERROR");
        return Mono.just(ResponseEntity.status(HttpStatus.CONFLICT).body(errorDetails));
    }

    @ExceptionHandler(InternalServerErrorException.class)
    public Mono<ResponseEntity<ErrorDetails>> handleInternalError(InternalServerErrorException ex) {
        ErrorDetails errorDetails = new ErrorDetails(LocalDateTime.now(), ex.getMessage(), "Internal Server Error", "INTERNAL_SERVER_ERROR");
        return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorDetails));
    }

    private Mono<ServerResponse> buildResponse(HttpStatus status, String message) {
        Map<String, Object> error = new HashMap<>();
        error.put("status", status.value());
        error.put("error", status.getReasonPhrase());
        error.put("message", message);

        return ServerResponse
                .status(status)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(error);
    }

    @ExceptionHandler(Exception.class)
    public Mono<ResponseEntity<ErrorDetails>> handleGlobalException(Exception ex, ServerWebExchange exchange) {
        String errorMessage = ex.getMessage();
        if (errorMessage != null && errorMessage.contains("Validation failed")) {
            List<String> requiredMessages = findRequiredMessages(errorMessage);
            if (!requiredMessages.isEmpty()) {
                errorMessage = String.join("; ", requiredMessages);
            }
        }
        ErrorDetails errorDetails = new ErrorDetails(LocalDateTime.now(), errorMessage, exchange.getRequest().getPath().toString(), "INTERNAL_SERVER_ERROR");
        return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorDetails));
    }

    @ExceptionHandler(ServerWebInputException.class)
    public Mono<ResponseEntity<ErrorDetails>> handleTypeMismatch(ServerWebInputException ex, ServerWebExchange exchange) {
        String path = exchange.getRequest().getPath().toString();
        String field = path.substring(path.lastIndexOf('/') + 1);
        String errorMessage = "Invalid input for field '" + field + "'. " + ex.getCause().getMessage();
        
        ErrorDetails errorDetails = new ErrorDetails(
                LocalDateTime.now(),
                errorMessage,
                path,
                "TYPE_MISMATCH"
        );
        return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorDetails));
    }

    @ExceptionHandler(WebExchangeBindException.class)
    public Mono<ResponseEntity<ErrorDetails>> handleValidationException(WebExchangeBindException ex, ServerWebExchange exchange) {
        List<String> errorMessages = ex.getBindingResult().getFieldErrors().stream()
                .map(fieldError -> fieldError.getField() + ": " + fieldError.getDefaultMessage())
                .toList();

        String errorMessage = String.join("; ", errorMessages);

        ErrorDetails errorDetails = new ErrorDetails(
                LocalDateTime.now(),
                errorMessage,
                exchange.getRequest().getPath().toString(),
                "VALIDATION_ERROR"
        );
        return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorDetails));
    }

    private static List<String> findRequiredMessages(String errorMessage) {
        List<String> requiredMessages = new ArrayList<>();
        Pattern pattern = Pattern.compile("default message \\[([^\\]]*required[^\\]]*)\\]");
        Matcher matcher = pattern.matcher(errorMessage);

        while (matcher.find()) {
            requiredMessages.add(matcher.group(1));
        }

        return requiredMessages;
    }
}
