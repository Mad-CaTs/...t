package world.inclub.membershippayment.buySuscription.api;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import reactor.core.publisher.Mono;
import world.inclub.membershippayment.buySuscription.aplication.service.BuySuscriptionService;
import world.inclub.membershippayment.crosscutting.utils.handler.ResponseHandler;
import world.inclub.membershippayment.domain.dto.request.CMeansPayment;
import world.inclub.membershippayment.domain.dto.request.ValidateCouponRequest;
import world.inclub.membershippayment.domain.dto.response.ValidateCouponResponse;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/store")
public class BuySuscriptionController {
    private final BuySuscriptionService buySuscriptionService;
    @PostMapping
    public Mono<ResponseEntity<Object>> portSuscription(@RequestBody CMeansPayment cMeansPayment){
        return ResponseHandler.generateMonoResponse(
                HttpStatus.CREATED,
                buySuscriptionService.buySuscription(cMeansPayment)
                        .map(Object.class::cast),
                true
        );
    }
    @GetMapping
    public Mono<String> test (){
        return Mono.just("Hello World from store");
    }

    @PostMapping("/validate-coupon")
    public Mono<ValidateCouponResponse> validateCoupon(@RequestBody ValidateCouponRequest request) {
        return buySuscriptionService.validateCoupon(request);
    }

}
