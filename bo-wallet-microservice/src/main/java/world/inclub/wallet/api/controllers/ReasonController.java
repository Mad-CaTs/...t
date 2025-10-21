package world.inclub.wallet.api.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import world.inclub.wallet.application.service.interfaces.IReasonService;
import world.inclub.wallet.domain.constant.ApiPaths;
import world.inclub.wallet.domain.entity.Reason;
import world.inclub.wallet.infraestructure.handler.ResponseHandler;

@RestController
@RequestMapping(ApiPaths.API_BASE_PATH + ApiPaths.NAME_SERVICE_REASON)
public class ReasonController {

    private final IReasonService reasonService;

    public ReasonController(IReasonService reasonService) {
        this.reasonService = reasonService;
    }

    @PostMapping("/save-reason")
    public Mono<ResponseEntity<Object>> getReason(@RequestBody Reason reason) {
        return ResponseHandler.generateResponse(HttpStatus.OK, reasonService.saveReason(reason), true);
    }

    @GetMapping("/find-reason/{idReason}")
    public Mono<ResponseEntity<Object>> getReasonById(@RequestParam Long idReason) {
        return ResponseHandler.generateResponse(HttpStatus.OK, reasonService.findById(idReason), true);
    }

    @GetMapping("/all")
    public Mono<ResponseEntity<Object>> getReasonById() {
        return ResponseHandler.generateResponse(HttpStatus.OK, reasonService.getAllReason(), true);
    }

}
