package world.inclub.wallet.api.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;
import world.inclub.wallet.api.dtos.SolicitudebankDTO;
import world.inclub.wallet.application.service.interfaces.IReasonDetailRetiroBankService;
import world.inclub.wallet.domain.constant.ApiPaths;
import world.inclub.wallet.domain.entity.ReasonDetailRetiroBank;
import world.inclub.wallet.infraestructure.handler.ResponseHandler;

@RestController
@RequestMapping(ApiPaths.API_BASE_PATH + ApiPaths.NAME_SERVICE_REASONDETAILBANK)
@RequiredArgsConstructor
public class ReasonDetailRetiroBankController {
    private  final IReasonDetailRetiroBankService iReasonDetailRetiroBankService;

    @PostMapping("/save")
    public Mono<ResponseEntity<Object>> saveSolicitudeAccountBank(
    @RequestBody ReasonDetailRetiroBank reasonDetailRetiroBank){
        return ResponseHandler.generateResponse(HttpStatus.OK,
                iReasonDetailRetiroBankService.saveReasonDetailRetiroBank(reasonDetailRetiroBank), true);

    }
}
