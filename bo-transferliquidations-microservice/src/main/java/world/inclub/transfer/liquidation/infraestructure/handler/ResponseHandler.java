package world.inclub.transfer.liquidation.infraestructure.handler;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Slf4j
public class ResponseHandler {

    private static final String TIMESTAMP_KEY = "timestamp";
    private static final String STATUS_KEY = "status";
    private static final String RESULT_KEY = "result";
    private static final String DATA_KEY = "data";
    private static final String MESSAGE_KEY = "message";

    /**
     * Este metodo se usa para generar él response de un Mono
     *
     * @param status: Resultado de la operacion
     * @param data: Datos de la operacion de tu servicio.
     * @param result: Retorna es true si tienes algo para retornar caso contrario como vacio se retorna false.
     * @return Mono<ResponseEntity<Object>>
     */
    @SuppressWarnings("unchecked")
    public static Mono<ResponseEntity<Object>> generateResponse(HttpStatus status, Object data, boolean result) {
        if (data instanceof Mono) {
            return generateMonoResponse(status, (Mono<Object>) data, result);
        } else if (data instanceof Flux) {
            return generateFluxResponse(status, (Flux<Object>) data, result);
        } else {
            return generateErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, new IllegalArgumentException("Unsupported data type"));
        }
    }

    private static Mono<ResponseEntity<Object>> generateMonoResponse(HttpStatus status, Mono<Object> data, boolean result) {
        Map<String, Object> map = new HashMap<>();

        try {
            return data.flatMap(d -> {
                map.put(TIMESTAMP_KEY, formatTimestamp(new Date()));
                map.put(STATUS_KEY, status.value());
                map.put(RESULT_KEY, result);
                map.put(DATA_KEY, d);
                return Mono.just(new ResponseEntity<>(map, status));
            });
        } catch (Exception exception) {
            log.error("Error while building response", exception);
            map.clear();
            return generateErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, exception);
        }
    }

    private static Mono<ResponseEntity<Object>> generateFluxResponse(HttpStatus status, Flux<Object> data, boolean result) {
        Map<String, Object> map = new HashMap<>();

        try {
            return data.collectList().flatMap(list -> {
                map.put(TIMESTAMP_KEY, formatTimestamp(new Date()));
                map.put(STATUS_KEY, status.value());
                map.put(RESULT_KEY, result);
                map.put(DATA_KEY, list);
                return Mono.just(new ResponseEntity<>(map, status));
            });
        } catch (Exception exception) {
            log.error("Error while building response", exception);
            map.clear();
            return generateErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, exception);
        }
    }


    private static String formatTimestamp(Date date) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        return dateFormat.format(date);
    }

    public static Mono<ResponseEntity<Object>> generateMessageResponse(HttpStatus status, String message, boolean result) {
        Map<String, Object> map = new HashMap<>();
        map.put(TIMESTAMP_KEY, formatTimestamp(new Date()));
        map.put(STATUS_KEY, status.value());
        map.put(RESULT_KEY, result);
        map.put(MESSAGE_KEY, message);
        map.put(DATA_KEY, null);
        return Mono.just(new ResponseEntity<>(map, status));
    }

    private static Mono<ResponseEntity<Object>> generateErrorResponse(HttpStatus status, Exception exception) {
        Map<String, Object> map = new HashMap<>();
        map.put(TIMESTAMP_KEY, new Date());
        map.put(STATUS_KEY, status.value());
        map.put(RESULT_KEY, false);
        map.put(MESSAGE_KEY, exception.getMessage());
        map.put(DATA_KEY, null);
        return Mono.just(new ResponseEntity<>(map, status));
    }

}
