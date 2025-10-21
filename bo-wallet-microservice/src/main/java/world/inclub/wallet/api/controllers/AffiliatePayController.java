package world.inclub.wallet.api.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.api.dtos.AffiliatePayDTO;
import world.inclub.wallet.api.dtos.DesaffiliateDTO;
import world.inclub.wallet.application.service.interfaces.IAffiliatePayService;
import world.inclub.wallet.domain.constant.ApiPaths;
import world.inclub.wallet.domain.entity.AffiliatePay;
import world.inclub.wallet.infraestructure.handler.ResponseHandler;
import world.inclub.wallet.infraestructure.serviceagent.dtos.response.PaymentResponse;
import world.inclub.wallet.infraestructure.serviceagent.service.MembershipPayment;


@Slf4j
@RestController
@RequestMapping(ApiPaths.API_BASE_PATH + ApiPaths.NAME_SERVICE_AFILIATIONPLAY)
@RequiredArgsConstructor
public class AffiliatePayController {

    private final IAffiliatePayService iAfiliatePlayService;
    private final MembershipPayment membershipPayment;

    @PostMapping("/affiliate")
    public Mono<ResponseEntity<Object>> generateAffiliatePay(@RequestBody AffiliatePayDTO request) {
        return ResponseHandler.generateResponse(HttpStatus.OK,
                iAfiliatePlayService.generateAffiliatePay(request),
                true);
    }

    @PutMapping("/desaffiliate")
    public Mono<ResponseEntity<Object>> generateDesAffiliatePay(@RequestBody DesaffiliateDTO request) {
        return ResponseHandler.generateResponse(HttpStatus.OK,
                iAfiliatePlayService.generateDesaffiliatePay(request),
                true);
    }

    @GetMapping("/allafiliatespay/{idUser}")
    public Flux<AffiliatePay> listAffiliatePayByIdUser(@PathVariable Long idUser) {
        return iAfiliatePlayService.getAffiliatePay(idUser);
    }

    @GetMapping("/afiliatebyid/{id}")
    public Mono<ResponseEntity<Object>> getDesafiliatePayById(@PathVariable Long id) {
        return ResponseHandler.generateResponse(HttpStatus.OK,
                iAfiliatePlayService.getAffiliatePayById(id), true);
    }

    @GetMapping("/payment/Due")
    public Flux<PaymentResponse> allPaymentToDue() {

        return membershipPayment.getAllPaymentDoue();
    }

}
