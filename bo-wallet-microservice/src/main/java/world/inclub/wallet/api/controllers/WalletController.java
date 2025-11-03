package world.inclub.wallet.api.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import world.inclub.wallet.api.dtos.WalletTransactionRequestDTO;
import world.inclub.wallet.application.service.interfaces.IWalletService;
import world.inclub.wallet.application.service.interfaces.UserWalletDataService;
import world.inclub.wallet.application.service.interfaces.WalletExcelReportService;
import world.inclub.wallet.domain.constant.ApiPaths;
import world.inclub.wallet.infraestructure.handler.ResponseHandler;
import world.inclub.wallet.infraestructure.persistence.WalletRepositoryImpl;
import world.inclub.wallet.infraestructure.serviceagent.dtos.response.UserWalletDataResponse;

@RestController
@RequestMapping(ApiPaths.API_BASE_PATH + ApiPaths.NAME_SERVICE_WALLET)
@RequiredArgsConstructor
public class WalletController {

    private final IWalletService iWalletService;
    private final UserWalletDataService userWalletDataService;
    private final WalletExcelReportService walletExcelReportService;

    private final WalletRepositoryImpl walletRepositoryImpl;

    @GetMapping("/test")
    public Mono<String> getApiWallet() {
        return Mono.just("Test API");
    }

    @GetMapping("/user/{idUser}")
    public Mono<ResponseEntity<Object>> getWalletByIdUser(@PathVariable("idUser") int idUser) {
        return ResponseHandler.generateResponse(HttpStatus.OK, iWalletService.getWalletByIdUser(idUser), true);
    }

    @PostMapping("/transaction/validate")
    public Mono<ResponseEntity<Object>> validate(@RequestBody WalletTransactionRequestDTO request) {
        return ResponseHandler.generateResponse(HttpStatus.OK,
                iWalletService.checkTransactionValidity(request.getIdUser(), request.getTransactionAmount()), true);
    }

    @GetMapping("/movements/{idUser}")
    public Mono<ResponseEntity<UserWalletDataResponse>> getUserWalletData(@PathVariable Integer idUser) {
        return userWalletDataService.getFullWalletDataByUserId(idUser)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @GetMapping("/movements/{idUser}/excel")
    public Mono<ResponseEntity<InputStreamResource>> downloadWalletExcel(@PathVariable Integer idUser) {
        return userWalletDataService.getFullWalletDataByUserId(idUser)
                .map(walletData -> walletExcelReportService.generateWalletReport(walletData))
                .map(excelStream -> {
                    InputStreamResource resource = new InputStreamResource(excelStream);
                    return ResponseEntity.ok()
                            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=wallet_report_" + idUser + ".xlsx")
                            .contentType(MediaType.parseMediaType(
                                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                            .body(resource);
                });
    }
}
