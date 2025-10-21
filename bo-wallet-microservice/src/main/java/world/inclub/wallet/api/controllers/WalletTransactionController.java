package world.inclub.wallet.api.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.api.dtos.*;
import world.inclub.wallet.application.service.interfaces.IWalletTransactionService;
import world.inclub.wallet.domain.constant.ApiPaths;
import world.inclub.wallet.domain.enums.CodeTypeWalletTransaction;
import world.inclub.wallet.infraestructure.handler.ResponseHandler;
import world.inclub.wallet.infraestructure.kafka.service.KafkaRequestReplyAccountService;
import world.inclub.wallet.infraestructure.serviceagent.service.NotificationService;

import java.util.Arrays;
import java.util.List;

@Slf4j
@RestController
@RequestMapping(ApiPaths.API_BASE_PATH + ApiPaths.NAME_SERVICE_WALLETTRANSACTION)
@RequiredArgsConstructor
public class WalletTransactionController {

    private final IWalletTransactionService iWalletTransactionService;
    private final NotificationService notificationService;
    private final KafkaRequestReplyAccountService serviceKafka;

    @GetMapping("/test")
    public Mono<String> getApiWalletTransaction() {
        return Mono.just("Test API");
    }

    //list de todos los movimientos
    @GetMapping("/list/{idWallet}")
    public Mono<ResponseEntity<Object>> getWalletSuccessfulTransactions(@PathVariable Integer idWallet,
                                                                        @RequestParam(value = "page", defaultValue = "0") int page,
                                                                        @RequestParam(value = "size", defaultValue = "10") int size,
                                                                        @RequestParam(value = "search", required = false) String search
    ) {
        return iWalletTransactionService.getWalletSuccessfulTransactionsWhitPagina(idWallet,page,size,search)
                .flatMap(tuple ->{
                    Flux<WalletTransactionResponseDTO> response = tuple.getT1();
                    Integer count = tuple.getT2();
                    Long x = Long.valueOf(count);

                    return ResponseHandler.generateResponseWithPagination(HttpStatus.OK, response, true, page, size, x);

        });
    }

    //list de todos las recargas
    @GetMapping("/list/recharge/{idWallet}")
    public Mono<ResponseEntity<Object>> getWalletRechargeTransactions(
            @PathVariable Integer idWallet,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "search", required = false) String search
    ) {

        // Aquí defines los IDs  de transacción
        Integer transferTypeIds = CodeTypeWalletTransaction.RECARGA_WALLET.getValue();

        return iWalletTransactionService.getWalletRechargeTransactionsWithPagination(idWallet, page, size, transferTypeIds,search)
                .flatMap(tuple -> {
                    Flux<WalletTransactionResponseDTO> response = tuple.getT1();
                    Integer count = tuple.getT2();
                    Long totalCount = Long.valueOf(count);
                    return ResponseHandler.generateResponseWithPagination(HttpStatus.OK, response, true, page, size, totalCount);
                });
    }

    //list de todos las transferencias
    @GetMapping("/list/transfers/{idWallet}")
    public Mono<ResponseEntity<Object>> getWalletTransferTransactions(
            @PathVariable Integer idWallet,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "search", required = false) String search) {

        // Aquí defines los IDs  de transacción
        List<Integer> transferTypeIds = Arrays.asList(CodeTypeWalletTransaction.ENVIO_TRANSFERENCIA.getValue(),
                CodeTypeWalletTransaction.RECEPCION_TRANSFERENCIA.getValue(),
                CodeTypeWalletTransaction.ENVIO_TRANSFERENCIA_PAGO_DESPUES.getValue(),
                CodeTypeWalletTransaction.RECEPCION_TRANSFERENCIA_PAGO_DESPUES.getValue(),
                CodeTypeWalletTransaction.DEVOLUCION_TRANSFERENCIA.getValue());

        return iWalletTransactionService.getWalletTransferTransactionsWithPagination(idWallet, page, size, transferTypeIds,search)
                .flatMap(tuple -> {
                    Flux<WalletTransactionResponseDTO> response = tuple.getT1();
                    Integer count = tuple.getT2();
                    Long totalCount = Long.valueOf(count);
                    return ResponseHandler.generateResponseWithPagination(HttpStatus.OK, response, true, page, size, totalCount);
                });
    }
    @GetMapping("/list/type-wallet-transaction")
    public Mono<ResponseEntity<Object>> listTypeWalletTransaction() {
        return ResponseHandler.generateResponse(HttpStatus.OK, iWalletTransactionService.listTypeWalletTransaction(), true);
    }

    @PostMapping("/transfer")
    public Mono<ResponseEntity<Object>> registerTransferBetweenPartners(
            @RequestBody WalletTransactionRequestDTO request) {
        return ResponseHandler.generateResponse(HttpStatus.OK,
                iWalletTransactionService.registerTransferBetweenPartners(request.getIdUser(),
                        request.getIdUserReceivingTransfer(), request.getWalletTransaction(),
                        request.getTokenRequest()),
                true);
    }

    @PostMapping("/transfer/between-wallets")
    public Mono<ResponseEntity<Object>> registerTransferBetweenWallets(
            @RequestBody WalletTransactionRequest request) {
        return ResponseHandler.generateResponse(HttpStatus.OK,
                iWalletTransactionService.registerTransferBetweenWallets(request),
                true);
    }

    @GetMapping("/validate-code/{walletCode}")
    public Mono<ResponseEntity<Object>> validateCode(@PathVariable Integer walletCode) {
        return ResponseHandler.generateResponse(HttpStatus.OK,iWalletTransactionService.validateWalletCode(walletCode),true);
    }


    @PostMapping("/charger/paypal/{code}")
    public Mono<ResponseEntity<Object>> chargerPaypal(
            @RequestBody AdminPanelTransactionRequest request,
            @PathVariable String code
    ) {
        return ResponseHandler.generateResponse(HttpStatus.OK,
                iWalletTransactionService.walletChargerPaypal(request, code), true);
    }

    @PostMapping("/paypal/sendnotification")
    public Mono<ResponseEntity<Object>> sendNotification(
            @RequestBody PaypalRechargeDTO request
    ){
        return ResponseHandler.generateResponse(HttpStatus.OK,
            notificationService.sendNotificationRechargePaypal(request.parseToInfo(), request.parseToUser()), true).onErrorResume(error -> {
            log.error("Error al enviar el correo: {}", error.getMessage());
            return Mono.empty();
        });
    }



}
