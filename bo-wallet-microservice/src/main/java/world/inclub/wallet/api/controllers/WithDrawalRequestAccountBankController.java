package world.inclub.wallet.api.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;
import world.inclub.wallet.api.dtos.WalletTransactionRequestDTO;
import world.inclub.wallet.application.service.interfaces.IWithdrawalRequestAccountBankService;
import world.inclub.wallet.domain.constant.ApiPaths;
import world.inclub.wallet.infraestructure.handler.ResponseHandler;

@RestController
@RequestMapping(ApiPaths.API_BASE_PATH + ApiPaths.NAME_SERVICE_WACCOUNTBANK)
@RequiredArgsConstructor
public class WithDrawalRequestAccountBankController {

    private final IWithdrawalRequestAccountBankService  iService;

    @GetMapping("/test")
    Mono<String> getApiWA(){
        return Mono.just("Test API");
    }


    @PostMapping(value = "/solicit", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Mono<ResponseEntity<Object>> generateWithdrawalRequestAccountBank(@RequestPart("file") Mono<FilePart> file,
            @RequestPart("data") WalletTransactionRequestDTO request) {
        return ResponseHandler.generateResponse(HttpStatus.OK, iService.generateWithDrawalRequestAccountBank(
                request.getWalletTransaction(), request.getIdUser(), request.getIdAccountBank(), file,request.getDescription()), true);
    }

    @GetMapping("/user/{idUser}")
    public Mono<ResponseEntity<Object>> getWithdrawalRequestElectronicPurseResponseByUser(@PathVariable("idUser") Integer idUser) {
        return ResponseHandler.generateResponse(HttpStatus.OK, iService.getWDRAccountBankByIdUser(idUser), true);

    }

}

//generateWithdrawalRequestAccountBank