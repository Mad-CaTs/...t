package world.inclub.membershippayment.api;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.aplication.service.SubscriptionBeneficiaryService;
import world.inclub.membershippayment.crosscutting.handler.ResponseHandler;
import world.inclub.membershippayment.domain.entity.SubscriptionBeneficiary;

@RestController
@Slf4j
@RequestMapping("/api/v1/beneficiaries")
class SubscriptionBeneficiaryController {

    @Autowired
    private SubscriptionBeneficiaryService subscriptionBeneficiaryService;

    @GetMapping("/")
    public Mono<ResponseEntity<Object>> listBeneficiaries(){
        return ResponseHandler.generateMonoResponse(
                HttpStatus.OK,
                subscriptionBeneficiaryService.gellAl()
                        .collectList()
                        .map(Object.class::cast),
                true);

    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<Object>> getById(@PathVariable Long id){
        return ResponseHandler.generateMonoResponse(
                HttpStatus.OK,
                subscriptionBeneficiaryService.getById(id)
                        .map(Object.class::cast),
                true
        );
    }

    @PostMapping("/")
    public Mono<ResponseEntity<Object>> createBeneficiary(@RequestBody SubscriptionBeneficiary beneficiary){
        return ResponseHandler.generateMonoResponse(
                HttpStatus.CREATED,
                subscriptionBeneficiaryService.saveBeneficiary(beneficiary).map(Object.class::cast),
                true
        );
    }

    @PutMapping("/{id}")
    public Mono<ResponseEntity<Object>> updateBeneficiary(@PathVariable Long id, @RequestBody SubscriptionBeneficiary beneficiary){
        return ResponseHandler.generateMonoResponse(
                HttpStatus.OK,
                subscriptionBeneficiaryService.updateBeneficiary(id, beneficiary).map(Object.class::cast),
                true
        );
    }

    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<Object>> deleteBeneficiary(@PathVariable Long id) {
        return ResponseHandler.generateMonoResponse(
                HttpStatus.NO_CONTENT,
                subscriptionBeneficiaryService.deleteBenefociary(id).then(Mono.empty()),
                true
        );
    }

    @GetMapping("/subscription/{subscriptionId}")
    public Mono<ResponseEntity<Object>> getBySubscriptionId(@PathVariable Long subscriptionId) {
        return ResponseHandler.generateMonoResponse(
                HttpStatus.OK,
                subscriptionBeneficiaryService.findBySubscriptionId(subscriptionId)
                        .collectList()
                        .map(Object.class::cast),
                true
        );
    }

    @GetMapping("/user/{userId}")
    public Mono<ResponseEntity<Object>> getAllBeneficiaries(@PathVariable Long userId, @RequestParam(value = "page", defaultValue = "0") int page,
                                                            @RequestParam(value = "size", defaultValue = "10") int size) {
        Flux<SubscriptionBeneficiary> beneficiaries = subscriptionBeneficiaryService.findByUserId(userId, page, size);
        Mono<Integer> total = subscriptionBeneficiaryService.countAllByUserId(userId);
        return total.flatMap(result -> ResponseHandler.generateResponseWithPagination(HttpStatus.OK, beneficiaries, true, page, size, result));

    }
}
