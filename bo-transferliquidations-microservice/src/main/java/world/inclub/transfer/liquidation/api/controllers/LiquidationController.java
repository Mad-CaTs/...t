package world.inclub.transfer.liquidation.api.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.application.service.interfaces.ILiquidationService;
import world.inclub.transfer.liquidation.domain.constant.ApiPaths;
import world.inclub.transfer.liquidation.domain.entity.Liquidation;
import world.inclub.transfer.liquidation.infraestructure.handler.ResponseHandler;

@RestController
@RequestMapping(ApiPaths.API_BASE_PATH + ApiPaths.NAME_SERVICE_LIQUIDATION)
@RequiredArgsConstructor
public class LiquidationController {

    private final ILiquidationService iLiquidationService;
    
    @PostMapping("/save")
    public Mono<ResponseEntity<Object>> saveTransfer(@RequestBody Liquidation request) {
        return ResponseHandler.generateResponse(HttpStatus.OK,
        		iLiquidationService.saveLiquidation(request), true);
    }

}
