package world.inclub.wallet.api.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import world.inclub.wallet.api.dtos.WalletTransactionRequestDTO;
import world.inclub.wallet.application.service.interfaces.IWalletService;
import world.inclub.wallet.domain.constant.ApiPaths;
import world.inclub.wallet.infraestructure.handler.ResponseHandler;
import world.inclub.wallet.infraestructure.persistence.WalletRepositoryImpl;

@RestController
@RequestMapping(ApiPaths.API_BASE_PATH + ApiPaths.NAME_SERVICE_WALLET)
@RequiredArgsConstructor
public class WalletController {

    private final IWalletService iWalletService;

    private final WalletRepositoryImpl walletRepositoryImpl;

    @GetMapping("/test")
    public Mono<String> getApiWallet() {
        return Mono.just("Test API");
    }

    @GetMapping("/user/{idUser}")
    public Mono<ResponseEntity<Object>> getWalletByIdUser(@PathVariable("idUser") int idUser) {
        return ResponseHandler.generateResponse(HttpStatus.OK, iWalletService.getWalletByIdUser(idUser), true);
    }

    @PostMapping("/transaction/validate")
    public Mono<ResponseEntity<Object>> validate(@RequestBody WalletTransactionRequestDTO request) {
        return ResponseHandler.generateResponse(HttpStatus.OK,
                iWalletService.checkTransactionValidity(request.getIdUser(), request.getTransactionAmount()), true);
    }

}
