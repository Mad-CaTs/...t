package world.inclub.appnotification.infraestructure.security.dto;

import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.support.WebExchangeBindException;
import reactor.core.publisher.Mono;

import java.util.stream.Collectors;

@Data
@Builder
@RequiredArgsConstructor
public class KeolaSecurityDtoStatus {
    final String code;
    final String message;

   public static Mono<ResponseEntity<KeolaSecurityDtoStatus>> handleWebExchangeBindException(WebExchangeBindException ex) {
        String errorMessage = ex.getFieldErrors()
                .stream()
                .map(fieldError -> fieldError.getField() + ": " + fieldError.getDefaultMessage())
                .collect(Collectors.joining(", "));

        KeolaSecurityDtoStatus errorResponse = KeolaSecurityDtoStatus.builder()
                .message(errorMessage)
                .code("VALIDATION_ERROR")
                .build();

        return Mono.just(new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST));
    }
}
