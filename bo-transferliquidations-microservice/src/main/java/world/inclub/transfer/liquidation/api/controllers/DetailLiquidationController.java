package world.inclub.transfer.liquidation.api.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.application.service.interfaces.IDetailLiquidationService;
import world.inclub.transfer.liquidation.domain.constant.ApiPaths;
import world.inclub.transfer.liquidation.domain.entity.DetailLiquidation;
import world.inclub.transfer.liquidation.infraestructure.handler.ResponseHandler;

@RestController
@RequestMapping(ApiPaths.API_BASE_PATH + ApiPaths.NAME_SERVICE_DETAIL_LIQUIDATION)
@RequiredArgsConstructor
public class DetailLiquidationController {

    private final IDetailLiquidationService iService;
    
    @PostMapping("/save")
    public Mono<ResponseEntity<Object>> saveDetailLiquidation(@RequestBody DetailLiquidation request) {
        return ResponseHandler.generateResponse(HttpStatus.OK,
        		iService.saveDetailLiquidation(request), true);
    }

}
