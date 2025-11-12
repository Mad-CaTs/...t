package world.inclub.transfer.liquidation.api.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.application.service.interfaces.IStatusService;
import world.inclub.transfer.liquidation.domain.constant.ApiPaths;
import world.inclub.transfer.liquidation.infraestructure.handler.ResponseHandler;

@RestController
@RequestMapping(ApiPaths.API_BASE_PATH + ApiPaths.NAME_SERVICE_STATUS)
@RequiredArgsConstructor
public class StatusController {

    private final IStatusService iStatusService;
    
    @GetMapping("/getAllStatus")
    public Mono<ResponseEntity<Object>> getAllStatus() {
        return ResponseHandler.generateResponse(HttpStatus.OK, iStatusService.getAllStatus(), true);
    }

}
