package world.inclub.transfer.liquidation.api.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;
// import world.inclub.transfer.liquidation.application.service.interfaces.IUserService;
import world.inclub.transfer.liquidation.infraestructure.apisExternas.account.AccountService;
import world.inclub.transfer.liquidation.infraestructure.apisExternas.account.request.SuscriptionRequest;
import world.inclub.transfer.liquidation.infraestructure.apisExternas.handler.ResponseHandler;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/test")
public class ExternalApiController {

    private final AccountService accountService;
    // private final IUserService userService;

    @GetMapping("/user/{username}")
    public Mono<ResponseEntity<Object>> getUser(@PathVariable String username ){
        return ResponseHandler.generateMonoResponse(HttpStatus.OK, accountService.getUserAccountByUsername(username).map(Object.class::cast), true);
    }


    @PostMapping("/save")
    public Mono<ResponseEntity<Object>> portRegister(@RequestBody SuscriptionRequest suscriptionRequest){
        return ResponseHandler.generateMonoResponse(
                HttpStatus.CREATED,
                accountService.postRegisterUser(suscriptionRequest)
                        .map(Object.class::cast),
                true
        );
    }

}
