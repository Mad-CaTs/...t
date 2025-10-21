package world.inclub.wallet.bankAccountWithdrawal.infrastructure.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.application.service.interfaces.BankWithdrawalStatusService;
import world.inclub.wallet.application.service.interfaces.ISolicitudeBankService;
import world.inclub.wallet.bankAccountWithdrawal.application.service.StatusReviewService;
import world.inclub.wallet.domain.constant.ApiPaths;
import world.inclub.wallet.bankAccountWithdrawal.domain.entity.StatusReview;
import world.inclub.wallet.infraestructure.kafka.dtos.response.BankWithdrawalStatusDto;

@RestController
@RequestMapping(ApiPaths.API_BASE_PATH + ApiPaths.NAME_SERVICE_BANKWITHDRAWALSTATUS)
@RequiredArgsConstructor
public class BankWithdrawalStatusController {

    private final BankWithdrawalStatusService bankWithdrawalStatusService;
    private final StatusReviewService statusReviewService;
    private final ISolicitudeBankService iSolicitudeBankService;

    @GetMapping
    public Flux<BankWithdrawalStatusDto> getAll() {
        return bankWithdrawalStatusService.findAll();
    }

    @GetMapping("/reviews")
    public Flux<StatusReview> getAllReviews() {
        return statusReviewService.findAll();
    }

    @PutMapping("/reviews/{id}")
    public Mono<ResponseEntity<Void>> updateReviewStatus(@PathVariable Long id, @RequestParam String username) {
        return iSolicitudeBankService.updateReviewStatus(id,username)
                .thenReturn(ResponseEntity.ok().build());
    }

}