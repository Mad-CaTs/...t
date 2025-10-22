package world.inclub.membershippayment.crosscutting.utils.handler;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.text.SimpleDateFormat;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

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
    public static Mono<ResponseEntity<Object>> generateMonoResponse(HttpStatus status, Mono<Object> data, boolean result) {
        Map<String, Object> map = new HashMap<>();

        try {
            return data.map(d -> {
                ZoneId zoneId = ZoneId.of("UTC-5");
                ZonedDateTime nowInUtc5 = ZonedDateTime.now(zoneId);
                map.put(TIMESTAMP_KEY, formatTimestamp(Date.from(nowInUtc5.toInstant())));
                map.put(STATUS_KEY, status.value());
                map.put(RESULT_KEY, result);
                // Check if the data is a List<Object>
                map.put(DATA_KEY, d);
                return new ResponseEntity<>(map, status);
            });
        } catch (Exception exception) {
            log.error("Error while building response", exception);
            map.clear();
            return generateErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, exception);
        }
    }

    /**
     * Este metodo se usa para generar él response de un Flux
     * @param status: Resultado de la operacion
     * @param data: Datos de la operacion de tu servicio.
     * @param result: Retorna es true si tienes algo para retornar caso contrario como vacio se retorna false.
     * @return Mono<ResponseEntity<Object>>
     */
    public static Mono<ResponseEntity<Object>> generateFluxResponse(HttpStatus status, Flux<Object> data, boolean result) {
        Map<String, Object> map = new HashMap<>();

        try {
            return data.collectList().map(d -> {
                map.put(TIMESTAMP_KEY, formatTimestamp(new Date()));
                map.put(STATUS_KEY, status.value());
                map.put(RESULT_KEY, result);
                // Check if the data is a List<Object>
                map.put(DATA_KEY, d);
                return new ResponseEntity<>(map, status);
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
