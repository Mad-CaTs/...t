package world.inclub.wallet.api.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;
import world.inclub.wallet.api.dtos.TokenRequestDTO;
import world.inclub.wallet.api.dtos.WalletTransactionRequestDTO;
import world.inclub.wallet.application.service.interfaces.ITokenWalletTransactionService;
import world.inclub.wallet.domain.constant.ApiPaths;
import world.inclub.wallet.infraestructure.handler.ResponseHandler;

@RestController
@RequestMapping(ApiPaths.API_BASE_PATH + ApiPaths.NAME_SERVICE_TOKENWALLETTRANSACTION)
@RequiredArgsConstructor
public class TokenWalletTransactionController {

    private final ITokenWalletTransactionService iTokenWalletTransactionService;

    @GetMapping("/test")
    Mono<String> getApiToken(){
        return Mono.just("Test API");
    }


    @PostMapping("create")
    public Mono<ResponseEntity<Object>> generateTokenTransaction(@RequestBody WalletTransactionRequestDTO request) {
        return ResponseHandler.generateResponse(HttpStatus.OK,
                iTokenWalletTransactionService.generateToken(request.getIdUser(), request.getIdUserReceivingTransfer()),
                true);
    }

    @PostMapping("create-gestion-bancario/{idUser}")
    public Mono<ResponseEntity<Object>> generateTokenGestionBancario(@PathVariable("idUser") int idUser ) {
        return ResponseHandler.generateResponse(HttpStatus.OK,
                iTokenWalletTransactionService.generateTokenGestionBancaria(idUser),
                true);
    }
    
    @PostMapping("validate")
    public Mono<ResponseEntity<Object>> verifyValidityToken(@RequestBody TokenRequestDTO request) {
        return ResponseHandler.generateResponse(HttpStatus.OK,
                iTokenWalletTransactionService.verifyValidityToken(request.getIdUser(), request.getCodeToken()),
                true);
    }
    @PostMapping("validate-bancario")
    public Mono<ResponseEntity<Object>> verifyValidityTokenGestionBancario(@RequestBody TokenRequestDTO request) {
        return ResponseHandler.generateResponse(HttpStatus.OK,
                iTokenWalletTransactionService.verifyValidityTokenGestionBancaria(request.getIdUser(), request.getCodeToken()),
                true);
    }
}
