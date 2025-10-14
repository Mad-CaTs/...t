package world.inclub.bonusesrewards.shared.response;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Slf4j
public class ResponseHandler {

    public static <T> Mono<ResponseEntity<ApiResponse<T>>> generateResponse(
            HttpStatus status, T data, boolean result) {
        return buildResponse(status, data, result);
    }

    public static <T> Mono<ResponseEntity<ApiResponse<T>>> generateResponse(
            HttpStatus status, Mono<T> data, boolean result) {
        return generateMonoResponse(status, data, result);
    }

    public static <T> Mono<ResponseEntity<ApiResponse<List<T>>>> generateResponse(
            HttpStatus status, Flux<T> data, boolean result) {
        return generateFluxResponse(status, data, result);
    }

    private static <T> Mono<ResponseEntity<ApiResponse<T>>> generateMonoResponse(HttpStatus status, Mono<T> data, boolean result) {
        return data.flatMap(d -> buildResponse(status, d, result));
    }

    private static <T> Mono<ResponseEntity<ApiResponse<List<T>>>> generateFluxResponse(HttpStatus status, Flux<T> data, boolean result) {
        return data.collectList().flatMap(list -> buildResponse(status, list, result));
    }

    private static <U> Mono<ResponseEntity<ApiResponse<U>>> buildResponse(HttpStatus status, U data, boolean result) {
        ApiResponse<U> apiResponse = ApiResponse.<U>builder()
                .timestamp(formatTimestamp(new Date()))
                .status(status.value())
                .result(result)
                .data(data)
                .build();
        return Mono.just(new ResponseEntity<>(apiResponse, status));
    }

    private static String formatTimestamp(Date date) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
        return dateFormat.format(date);
    }

}

