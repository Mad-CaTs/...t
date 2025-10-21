package world.inclub.wallet.api.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;
import world.inclub.wallet.application.service.interfaces.IAccountBankService;
import world.inclub.wallet.domain.constant.ApiPaths;
import world.inclub.wallet.infraestructure.handler.ResponseHandler;

@RestController
@RequestMapping(ApiPaths.API_BASE_PATH + ApiPaths.NAME_SERVICE_ACCOUNTBANK)
@RequiredArgsConstructor
public class AccountBankController {

    private final IAccountBankService iAccountBankService;

     @GetMapping("user/{idUser}")
    public Mono<ResponseEntity<Object>> getAccountBankByIdUser(@PathVariable("idUser") Integer idUser) {
        return ResponseHandler.generateResponse(HttpStatus.OK, iAccountBankService.getAccountBankByIdUser(idUser), true);
    }

}
