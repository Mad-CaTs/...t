package world.inclub.transfer.liquidation.api.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.application.service.interfaces.ITypeTransferService;

import world.inclub.transfer.liquidation.domain.constant.ApiPaths;
import world.inclub.transfer.liquidation.infraestructure.handler.ResponseHandler;

@RestController
@RequestMapping(ApiPaths.API_BASE_PATH + ApiPaths.NAME_SERVICE_TYPE_TRANSFER)
@RequiredArgsConstructor
@Slf4j
public class TypeTransferController {

    private final ITypeTransferService typeTransferService;

    @GetMapping("/getAll")
    public Mono<ResponseEntity<Object>> getAll() {
        return ResponseHandler.generateResponse(HttpStatus.OK, typeTransferService.getAllTransfer(), true);
    }
    
    @GetMapping("/transfer/types")
    public Mono<ResponseEntity<Object>> getTransferTypes(
        @RequestParam(value = "idUser", required = false) Integer idUser,
        @RequestParam(value = "username", required = false) String username,
        @RequestParam(value = "requestedType", required = false) Integer requestedType) {
        log.debug("getTransferTypes called with idUser={}, username={}, requestedType={}", idUser, username, requestedType);
    return typeTransferService.getFilteredTransferTypes(idUser, username, requestedType)
        .flatMap(list -> ResponseHandler.generateResponse(HttpStatus.OK, Mono.just(list).cast(Object.class), true))
        .onErrorResume(ex -> {
            if (ex instanceof world.inclub.transfer.liquidation.infraestructure.exception.common.ResourceNotFoundException) {
            return ResponseHandler.generateMessageResponse(HttpStatus.NOT_FOUND, ex.getMessage(), false);
            }
            if (ex instanceof org.springframework.web.server.ResponseStatusException rse) {
            org.springframework.http.HttpStatus status = org.springframework.http.HttpStatus.valueOf(rse.getStatusCode().value());
            String msg = rse.getReason() == null ? rse.getMessage() : rse.getReason();
            return ResponseHandler.generateMessageResponse(status, msg, false);
            }

            // Fallback: internal error
            log.error("Error obteniendo tipos de traspaso para idUser {} username {}", idUser, username, ex);
            return ResponseHandler.generateMessageResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                "Error interno al obtener tipos", false);
        });
    }
}
