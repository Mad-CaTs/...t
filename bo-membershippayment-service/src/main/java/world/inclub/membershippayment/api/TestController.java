package world.inclub.membershippayment.api;

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
import world.inclub.membershippayment.infraestructure.apisExternas.account.AccountService;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.AdminPanelService;

import world.inclub.membershippayment.crosscutting.utils.handler.ResponseHandler;
import world.inclub.membershippayment.domain.dto.request.SuscriptionRequest;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/test")
public class TestController {

    private final AccountService accountService;
    private final AdminPanelService adminPanelService;


    @GetMapping("/pack/{idPack}/{idPayment}")
    public Mono<ResponseEntity<Object>> getPack(@PathVariable Integer idPack,@PathVariable Integer idPayment){
        return ResponseHandler.generateMonoResponse(HttpStatus.OK, adminPanelService.getPackData(idPack, idPayment).map(Object.class::cast), true);
    }


    @GetMapping("/admin/dolar")
    public Mono<ResponseEntity<Object>> getRate(){
        return ResponseHandler.generateMonoResponse(HttpStatus.OK, adminPanelService.getTypeExchange().map(Object.class::cast), true);
    }

    @GetMapping("/admin/{pay}")
    public Mono<ResponseEntity<Object>> getPay(@PathVariable Integer pay){
        return ResponseHandler.generateMonoResponse(HttpStatus.OK, adminPanelService.getPaymentSubType(pay).map(Object.class::cast), true);
    }

    @GetMapping("/user/{idUser}")
    public Mono<ResponseEntity<Object>> getUser(@PathVariable Integer idUser ){
        return ResponseHandler.generateMonoResponse(HttpStatus.OK, accountService.getUserAccountById(idUser).map(Object.class::cast), true);
    }

    @PostMapping
    public Mono<ResponseEntity<Object>> portRegister(@RequestBody SuscriptionRequest suscriptionRequest){
        return ResponseHandler.generateMonoResponse(
                HttpStatus.CREATED,
                accountService.postRegisterUser(suscriptionRequest)
                        .map(Object.class::cast),
                true
        );
    }

}
