package world.inclub.membershippayment.api;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.aplication.service.SubscriptionCouponService;
import world.inclub.membershippayment.crosscutting.utils.handler.ResponseHandler;
import org.springframework.http.HttpStatus;
import world.inclub.membershippayment.domain.dto.request.SuscriptionCouponRequest;
import world.inclub.membershippayment.domain.dto.response.ResponseCouponDTO;
import world.inclub.membershippayment.domain.dto.response.ResponseCouponTotalDTO;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/coupons")
public class SubscriptionCouponController {

    private final SubscriptionCouponService couponService;

    @GetMapping("/all/{page}/{size}")
    public Mono<ResponseEntity<Map<String, Object>>> getAllCoupons(
            @PathVariable(value="page") Integer page,
            @PathVariable(value="size") Integer size,
            @RequestParam(value = "search", required = false, defaultValue="") String search,
            @RequestParam(value = "idbus", required = false, defaultValue="0") Integer idbus,
            @RequestParam(value = "ispartner", defaultValue = "true") Boolean ispartner
    ) {
        return couponService.getAllCouponsPaginateAndSearch(ispartner, page, size, search, idbus)
                .collectList()
                .flatMap(coupons ->
                        Mono.zip(
                                Mono.just(coupons),
                                couponService.findByCustomiserParamsAllPag(ispartner, search, idbus)
                        )
                )
                .map(tuple -> {

                    List<ResponseCouponDTO> coupons = tuple.getT1();
                    ResponseCouponTotalDTO totalReg = tuple.getT2();
                    Integer totalPages = (int) Math.ceil((double) totalReg.totalRecords() / (size>0 ? size : 1));
                    System.out.println("Total Records: " + totalReg.totalRecords()+ " Total Pages: " + totalPages);
                    Map<String, Object> response = new HashMap<>();
                    response.put("data", coupons);
                    response.put("state", true);
                    response.put("message", "Lista de coupons obtenida exitosamente");
                    response.put("total", coupons.size());
                    response.put("totalPages", totalPages);
                    response.put("totalRecords", totalReg.totalRecords());
                    response.put("page", page);
                    response.put("size", size);
                    response.put("hasNext", page < totalPages );
                    response.put("hasPrevious", page > 1);
                    return ResponseEntity.ok(response);
                })
                .defaultIfEmpty(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of(
                                "data", Collections.emptyList(),
                                "state", false,
                                "message", "No se encontraron coupons",
                                "total", 0,
                                "page", page-1,
                                "size", size
                        )))
                .onErrorResume(error -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of(
                                "data", Collections.emptyList(),
                                "state", false,
                                "message", "Error interno: " + error.getMessage(),
                                "total", 0,
                                "page", page,
                                "size", size
                        ))));
    }

    @GetMapping({"/search/{code}"})
    public Mono<ResponseEntity<Map<String, Object>>> getCouponByCode(
            @PathVariable(value="code") String code
    ) {
        return couponService.findByStateIsTrueAndCode(code)
                        .map(coupon -> {
                            Map<String, Object> response = new HashMap<>();
                            response.put("data", coupon);
                            response.put("state", true);
                            response.put("message", "Coupon encontrado");
                            return ResponseEntity.ok(response);
                        })
                        .defaultIfEmpty(searchByCodeErrorResponse());

    }

    @GetMapping({"/searchactive/{idsus}/{iduser}"})
    public Mono<ResponseEntity<Map<String, Object>>> getCouponByIdSuscriptionIduser(
            @PathVariable(value="idsus") Integer idsus,
            @PathVariable(value="iduser") Integer iduser
    ) {
        return couponService.findByIdSuscriptionAndUserId(idsus, iduser)
                .map(coupon -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("data", coupon);
                    response.put("state", true);
                    response.put("message", "Coupon encontrado");
                    return ResponseEntity.ok(response);
                })
                .defaultIfEmpty(searchByCodeErrorResponse());

    }

    @DeleteMapping("/delete/{idcoupon}")
    public Mono<ResponseEntity<Object>> deleteCouponById(
            @PathVariable(value="idcoupon") Integer idcoupon
    ) {
        return ResponseHandler.generateMonoResponse(
                HttpStatus.OK,
                couponService.deleteCouponByIdentity(idcoupon)
                        .map(ResponseEntity::ok),
                true
        );
    }

    @PostMapping("/create")
    public Mono<ResponseEntity<Map<String, Object>>> createCoupon(
            @RequestBody SuscriptionCouponRequest suscriptionRequest
    ) {
        return couponService.createCoupon(suscriptionRequest)
                        .map(suscriptionCoupon -> {
                            Map<String, Object> response = new HashMap<>();
                            response.put("data", suscriptionCoupon);
                            response.put("state", true);
                            response.put("message", "Coupon creado exitosamente");
                            return ResponseEntity.status(HttpStatus.CREATED).body(response);
                        }).defaultIfEmpty(createErrorResponse());
    }

    @PutMapping("/update/{idcopon}")
    public Mono<ResponseEntity<Map<String, Object>>> updateCoupon(
            @PathVariable(value="idcopon") Integer idcopon,
            @RequestBody SuscriptionCouponRequest suscriptionCoupon
    ) {
        return couponService.updateCoupon(suscriptionCoupon, idcopon)
                                .map( update-> {
                                    Map<String, Object> response = new HashMap<>();
                                    response.put("data", update);
                                    response.put("state", true);
                                    response.put("message", "Coupon actualizado exitosamente");
                                    return ResponseEntity.status(HttpStatus.OK).body(response);

                                }).defaultIfEmpty(createErrorResponse());

    }

    @GetMapping("/paginate")
    public Mono<ResponseEntity<ResponseCouponTotalDTO>> getAllCouponsPaginate(
            @RequestParam(value = "search", required = false, defaultValue="") String search,
            @RequestParam(value = "idbus", required = false, defaultValue="0") Integer idbus,
            @RequestParam(value = "ispartner", defaultValue = "true") Boolean ispartner
    ) {
        return couponService.findByCustomiserParamsAllPag(ispartner, search, idbus)
                .map( totalReg -> ResponseEntity.ok(totalReg))
                .defaultIfEmpty(ResponseEntity.status(HttpStatus.NOT_FOUND).build())
                .onErrorResume(error -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()));

    }

    // Método auxiliar con el tipo correcto
    private ResponseEntity<Map<String, Object>> searchByCodeErrorResponse() {
        Map<String, Object> response = new HashMap<>();
        response.put("data", null);
        response.put("state", false);
        response.put("message", "No se encontró el coupon con los parámetros proporcionados");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    private ResponseEntity<Map<String, Object>> createErrorResponse() {
        Map<String, Object> response = new HashMap<>();
        response.put("data", "No se pudo crear el cupón");
        response.put("state", false);
        response.put("message", "El codigo de cupón ya existe o no se pudo crear.");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    private ResponseEntity<Map<String, Object>> createErrorResponse(Throwable error) {
        Map<String, Object> response = new HashMap<>();
        response.put("data", Collections.emptyList());
        response.put("state", false);
        response.put("message", "Error: " + error.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

}
