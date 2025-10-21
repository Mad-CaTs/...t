package world.inclub.wallet.bankAccountWithdrawal.application.processor;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import world.inclub.wallet.api.dtos.SolicitudeBankFilterDto;
import world.inclub.wallet.bankAccountWithdrawal.application.dto.ValidationResult;
import world.inclub.wallet.bankAccountWithdrawal.application.enums.BankStatus;
import world.inclub.wallet.bankAccountWithdrawal.application.enums.StatusReview;
import world.inclub.wallet.bankAccountWithdrawal.application.service.AuditLogService;
import world.inclub.wallet.bankAccountWithdrawal.application.service.StorageService;
import world.inclub.wallet.bankAccountWithdrawal.domain.entity.BankAccount;
import world.inclub.wallet.bankAccountWithdrawal.domain.port.ExcelReaderPort;
import world.inclub.wallet.infraestructure.kafka.dtos.response.SolicitudeBankDto;
import world.inclub.wallet.infraestructure.serviceagent.dtos.AccountBankRequestDTO;
import world.inclub.wallet.infraestructure.serviceagent.dtos.response.AccountBankByClientResponse;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class ExcelValidationProcessor {

    private final ExcelReaderPort excelReaderPort;
    private final StorageService storageService;
    private final AuditLogService auditLogService;

    public Mono<ValidationResult> processExcel(FilePart filePart, String username) {
        return DataBufferUtils.join(filePart.content())
                .flatMap(dataBuffer -> {
                    byte[] bytes = new byte[dataBuffer.readableByteCount()];
                    dataBuffer.read(bytes);
                    DataBufferUtils.release(dataBuffer);

                    String filename = filePart.filename();
                    String folderNumber = "32";
                    String size = String.valueOf(bytes.length);
                    return storageService.uploadToS3(filename, bytes, folderNumber)
                            .flatMap(url -> {
                                log.info("Excel subido a S3: {}", url);
                                return excelReaderPort.readExcel(filePart)
                                        .flatMap(this::validateAndUpdate)
                                        .flatMap(validationResult -> {
                                            int recordsCount = validationResult.getTotalRecords();
                                            return auditLogService.saveType2(username, null, url, StatusReview.UPLOAD_EXCEL.getCode(), recordsCount, size
                                            ).thenReturn(validationResult);
                                        });
                            });
                });
    }

    private Mono<ValidationResult> validateAndUpdate(List<BankAccount> excelData) {
        SolicitudeBankFilterDto filtro = new SolicitudeBankFilterDto();

        return excelReaderPort.getPendingAccounts(filtro)
                .flatMap(pendingList ->
                        filterExcelData(excelData)
                                .flatMap(apiResponses ->
                                        processAndUpdateStatuses(excelData, pendingList, apiResponses)));
    }

    private Mono<List<AccountBankByClientResponse>> filterExcelData(List<BankAccount> excelData) {
        List<AccountBankRequestDTO.FilterItem> filters = excelData.stream()
                .map(item -> AccountBankRequestDTO.FilterItem.builder()
                        .numberAccount(item.getNumberAccount())
                        .fullName(item.getFullName())
                        .numDocument(item.getNumDocument())
                        .build())
                .toList();

        return excelReaderPort.searchAccounts(AccountBankRequestDTO.builder().filters(filters).build());
    }

    private Mono<ValidationResult> processAndUpdateStatuses(
            List<BankAccount> excelData,
            List<SolicitudeBankDto> pendingList,
            List<AccountBankByClientResponse> apiResponses) {

        List<String> errors = new ArrayList<>();
        List<String> warnings = new ArrayList<>();
        Map<Integer, List<Long>> estadoAIds = new HashMap<>();

        Map<String, AccountBankByClientResponse> apiByAccount = apiResponses.stream()
                .filter(r -> r.getNumberAccount() != null)
                .collect(Collectors.toMap(AccountBankByClientResponse::getNumberAccount, r -> r, (a, b) -> a));

        Map<Integer, SolicitudeBankDto> pendingByAccountBankId = pendingList.stream()
                .collect(Collectors.toMap(SolicitudeBankDto::getIdAccountBank, p -> p, (a, b) -> a));

        for (int i = 0; i < excelData.size(); i++) {
            BankAccount excelItem = excelData.get(i);
            int rowNumber = i + 2;
            String account = excelItem.getNumberAccount();

            if (account == null || account.isEmpty()) {
                errors.add("Fila " + rowNumber + ": Número de cuenta vacío");
                continue;
            }

            AccountBankByClientResponse apiResp = apiByAccount.get(account);
            if (apiResp == null || apiResp.getId() == null) {
                warnings.add("Fila " + rowNumber + " (Cuenta " + account + "): No encontrada en sistema");
                continue;
            }

            SolicitudeBankDto pendingItem = pendingByAccountBankId.get(apiResp.getId());
            if (pendingItem == null) {
                warnings.add("Fila " + rowNumber + " (ID " + apiResp.getId() + "): Sin solicitud Pre-aprobada");
                continue;
            }

            Integer nuevoEstado = determinarNuevoEstado(excelItem.getEstado());
            if (nuevoEstado == null) {
                warnings.add("Fila " + rowNumber + ": Estado '" + excelItem.getEstado() + "' no reconocido");
                continue;
            }

            if (!nuevoEstado.equals(pendingItem.getIdBankStatus())) {
                estadoAIds.computeIfAbsent(nuevoEstado, k -> new ArrayList<>())
                        .add(pendingItem.getIdsolicitudebank());
            }
        }

        long totalAActualizar = estadoAIds.values().stream().mapToLong(List::size).sum();
        if (estadoAIds.isEmpty()) {
            return Mono.just(ValidationResult.builder()
                    .valid(errors.isEmpty())
                    .errors(errors)
                    .warnings(warnings)
                    .totalRecords(excelData.size())
                    .validRecords(0)
                    .message(errors.isEmpty() ? "No hay cambios de estado" : "Errores encontrados, sin actualizaciones")
                    .build());
        }

        List<Mono<Boolean>> updates = estadoAIds.entrySet().stream()
                .map(e -> excelReaderPort.updateBankStatuses(e.getValue(), e.getKey()))
                .toList();

        return Mono.zip(updates, results -> {
            boolean allSuccess = Arrays.stream(results).allMatch(r -> r instanceof Boolean b && b);

            return ValidationResult.builder()
                    .valid(errors.isEmpty() && allSuccess)
                    .errors(errors)
                    .warnings(warnings)
                    .totalRecords(excelData.size())
                    .validRecords((int) totalAActualizar)
                    .message(allSuccess
                            ? "✓ Actualización exitosa: " + totalAActualizar + " registros"
                            : "✗ Algunos registros fallaron")
                    .build();
        });
    }

    private Integer determinarNuevoEstado(String estadoExcel) {
        if (estadoExcel == null || estadoExcel.isBlank()) return null;

        return switch (estadoExcel.toLowerCase().trim()) {
            case "procesada", "aprobado", "aprobada", "aprobado bcp", "ok", "si" -> BankStatus.APROBADO.getId();
            case "rechazada", "rechazado", "rechazar", "observada", "observado", "no" -> BankStatus.RECHAZADO.getId();
            default -> null;
        };
    }

}
