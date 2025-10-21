package world.inclub.wallet.api.controllers;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.api.dtos.SolicitudBankMassiveUpdateDto;
import world.inclub.wallet.api.dtos.SolicitudBankStatusDto;
import world.inclub.wallet.api.dtos.SolicitudeBankFilterDto;
import world.inclub.wallet.api.dtos.SolicitudebankDTO;
import world.inclub.wallet.api.dtos.WalletTransactionResponseDTO;
import world.inclub.wallet.application.service.interfaces.ISolicitudeBankService;
import world.inclub.wallet.domain.constant.ApiPaths;
import world.inclub.wallet.domain.entity.Solicitudebank;
import world.inclub.wallet.infraestructure.handler.ResponseHandler;
import world.inclub.wallet.infraestructure.kafka.dtos.response.SolicitudeBankDto;


@RestController
@RequestMapping(ApiPaths.API_BASE_PATH + ApiPaths.NAME_SERVICE_SOLICITUDEACCOUNTBANK)
@RequiredArgsConstructor
public class SolicitudeBankController {
    private static final Logger log = LoggerFactory.getLogger(SolicitudeBankController.class);
    private final ISolicitudeBankService iSolicitudeBankService;

    @PostMapping("/listPen")
    public Mono<ResponseEntity<Object>> getPenndingAccountBankByIdUser(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestBody SolicitudeBankFilterDto filtros) {

        return iSolicitudeBankService.getPenndingAccountBankByIdUser(page, size, filtros)
                .flatMap(tuple -> {
                    Flux<SolicitudeBankDto> response = tuple.getT1();
                    Integer count = tuple.getT2();
                    Long totalCount = Long.valueOf(count);
                    return ResponseHandler.generateGroupedResponseWithPagination(HttpStatus.OK, response, true, page, size, totalCount, SolicitudeBankDto::getCurrencyIdBank);
                });
    }
    @GetMapping("/listVerif")
    public Mono<ResponseEntity<Object>> getVerificadosAccountBankByIdUser(
           // @PathVariable("idUser") Integer idUser,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "search", required = false) String search
    ) {
        return iSolicitudeBankService.getVerificadoAccountBankByIdUser(page, size,search)
                .flatMap(tuple ->{
                    Flux<SolicitudeBankDto> response = tuple.getT1();
                    Integer count = tuple.getT2();
                    Long totalCount = Long.valueOf(count);
                    return ResponseHandler.generateResponseWithPagination(HttpStatus.OK, response, true, page, size, totalCount);

                });
    }
    @PostMapping("/save")
    public Mono<ResponseEntity<Object>> saveSolicitudeAccountBank(
            @RequestBody SolicitudebankDTO solicitudebankDTO) {
        return ResponseHandler.generateResponse(HttpStatus.OK,
                iSolicitudeBankService.saveAccountBank(solicitudebankDTO), true);
    }
    
    @PutMapping("/update-masivo")
    public Mono<ResponseEntity<Object>> updateMasivaSolicitudeAccountBank(
            @RequestBody SolicitudBankMassiveUpdateDto solicitudBankMassiveUpdateDto , @RequestParam String username) {
        return ResponseHandler.generateResponse(HttpStatus.OK,
                iSolicitudeBankService.updateMasivaSolicitudeAccountBankOptimized(solicitudBankMassiveUpdateDto,username), true);
    }
    
    @PutMapping("/update")
    public Mono<ResponseEntity<Object>> updateSolicitudeAccountBank(
            @RequestBody SolicitudBankStatusDto solicitudBankStatusDto , @RequestParam String username) {
        return ResponseHandler.generateResponse(HttpStatus.OK,
                iSolicitudeBankService.updateAccountBank(solicitudBankStatusDto,username), true);
    }
}
