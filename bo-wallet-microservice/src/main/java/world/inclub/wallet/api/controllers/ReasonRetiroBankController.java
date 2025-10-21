package world.inclub.wallet.api.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;
import world.inclub.wallet.application.service.interfaces.IReasonRetiroBankService;
import world.inclub.wallet.domain.constant.ApiPaths;
import world.inclub.wallet.infraestructure.handler.ResponseHandler;

@RestController
@RequestMapping(ApiPaths.API_BASE_PATH + ApiPaths.NAME_SERVICE_REASONKBANK)
@RequiredArgsConstructor
public class ReasonRetiroBankController {

    private final IReasonRetiroBankService iReasonRetiroBankService;

    @GetMapping("/list")
    public Mono<ResponseEntity<Object>> getReasonRetiroBank(){
        return ResponseHandler.generateResponse(HttpStatus.OK,
                iReasonRetiroBankService.getAllReasonRetiroBank(),true);
    }

}
