package world.inclub.transfer.liquidation.api.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.application.service.interfaces.IReasonLiquidationService;
import world.inclub.transfer.liquidation.domain.constant.ApiPaths;
import world.inclub.transfer.liquidation.infraestructure.handler.ResponseHandler;

@RestController
@RequestMapping(ApiPaths.API_BASE_PATH + ApiPaths.NAME_SERVICE_REASON_LIQUIDATION)
@RequiredArgsConstructor
public class ReasonLiquidationController {

    private final IReasonLiquidationService iService;

    @GetMapping("/getAll")
    public Mono<ResponseEntity<Object>> getAll() {
        return ResponseHandler.generateResponse(HttpStatus.OK, iService.getAllReasonLiquidation(), true);
    }

}
