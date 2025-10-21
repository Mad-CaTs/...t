package world.inclub.wallet.bankAccountWithdrawal.infrastructure.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import world.inclub.wallet.bankAccountWithdrawal.application.dto.CombinedValidationResult;
import world.inclub.wallet.bankAccountWithdrawal.application.dto.ValidationResult;
import world.inclub.wallet.bankAccountWithdrawal.application.service.GeneralInformationService;
import world.inclub.wallet.domain.constant.ApiPaths;

import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(ApiPaths.API_BASE_PATH + ApiPaths.NAME_SERVICE_VALIDATE)
public class GneralInformationController {

    private final GeneralInformationService service;

    @PostMapping("/validate1")
    public Mono<ResponseEntity<ValidationResult>> validate() {
        return service.validate()
                .map(result -> {
                    if (result.isValid()) {
                        return ResponseEntity.ok(result);
                    } else {
                        return ResponseEntity.badRequest().body(result);
                    }
                });
    }

    @PostMapping("/validate2")
    public Mono<ResponseEntity<ValidationResult>> validatePosition() {
        return service.validatePosition()
                .map(result -> {
                    if (result.isValid()) {
                        return ResponseEntity.ok(result);
                    } else {
                        return ResponseEntity.badRequest().body(result);
                    }
                });
    }

    @PostMapping("/validate3")
    public Mono<ValidationResult> validateBCP() {
        return service.validateDateSubscriptionRecive();
    }

    @PostMapping("/validateAllBCP")
    public Mono<ResponseEntity<CombinedValidationResult>> validateAll(@RequestParam String username) {
        return service.validateAll(username)
                .map(result -> {
                    int invalidCount = result.countInvalid();
                    if (invalidCount >= 2) {
                        return ResponseEntity.badRequest().body(result);
                    }
                    return ResponseEntity.ok(result);
                });
    }

    @PostMapping("/validateAllBCPv2")
    public Mono<ResponseEntity<CombinedValidationResult>> validateAllPreAprove() {
        return service.validateAllPreAprove()
                .map(result -> {
                    int invalidCount = result.countInvalid();
                    if (invalidCount >= 2) {
                        return ResponseEntity.badRequest().body(result);
                    }
                    return ResponseEntity.ok(result);
                });
    }

    @GetMapping("/download-txt")
    public Mono<ResponseEntity<Resource>> downloadMacro(@RequestParam String username) {
        return service.generateMacroContent(username)
                .map(bytes -> {
                    ByteArrayResource resource = new ByteArrayResource(bytes);
                    return ResponseEntity.ok()
                            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=macro.txt")
                            .contentType(MediaType.TEXT_PLAIN)
                            .contentLength(bytes.length)
                            .body((Resource) resource);
                })
                .doOnError(e -> log.error("Error generando macro: {}", e.getMessage(), e));
    }

    @GetMapping("/download-excel")
    public Mono<ResponseEntity<byte[]>> downloadPreApproveExcel(@RequestParam String username) {
        return service.validateAllPreAproveAndGenerateExcel(username)
                .flatMap(result -> {
                    byte[] excelBytes = result.getExcelBytes();

                    if (excelBytes == null || excelBytes.length == 0) {
                        log.warn("Excel vacío, no se pudo generar con datos");
                        return Mono.just(ResponseEntity.noContent().build());
                    }

                    return Mono.just(ResponseEntity.ok()
                            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=preapprove.xlsx")
                            .contentType(MediaType.APPLICATION_OCTET_STREAM)
                            .body(excelBytes));
                });
    }

    @PostMapping(value = "/uploadBCP", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Mono<ResponseEntity<ValidationResult>> uploadExcelv2(
            @RequestPart("file") FilePart filePart,
            @RequestParam String username) {

        log.info("Controller - Subiendo archivo Excel");

        return service.processExcel(filePart, username)
                .map(ResponseEntity::ok)
                .onErrorResume(ex -> {
                    log.error("Error procesando Excel: {}", ex.getMessage(), ex);
                    return Mono.just(ResponseEntity
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body(ValidationResult.builder()
                                    .valid(false)
                                    .errors(List.of(ex.getMessage()))
                                    .message("Error al procesar el archivo")
                                    .build()));
                });
    }
}