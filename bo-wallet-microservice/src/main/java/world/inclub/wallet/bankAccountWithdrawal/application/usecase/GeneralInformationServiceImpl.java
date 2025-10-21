package world.inclub.wallet.bankAccountWithdrawal.application.usecase;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.util.function.Tuples;
import world.inclub.wallet.bankAccountWithdrawal.application.dto.CombinedValidationResult;
import world.inclub.wallet.api.dtos.SolicitudeBankFilterDto;
import world.inclub.wallet.bankAccountWithdrawal.application.dto.SubscriptionValidationDto;
import world.inclub.wallet.bankAccountWithdrawal.application.dto.ValidationResult;
import world.inclub.wallet.application.service.interfaces.ISolicitudeBankService;
import world.inclub.wallet.bankAccountWithdrawal.application.enums.StatusReview;
import world.inclub.wallet.bankAccountWithdrawal.application.processor.ExcelValidationProcessor;
import world.inclub.wallet.bankAccountWithdrawal.application.processor.GenerateMacroBCP;
import world.inclub.wallet.bankAccountWithdrawal.application.processor.InMemoryFilePart;
import world.inclub.wallet.bankAccountWithdrawal.application.processor.SubscriptionProcessor;
import world.inclub.wallet.bankAccountWithdrawal.application.service.AuditLogService;
import world.inclub.wallet.bankAccountWithdrawal.application.service.GeneralInformationService;
import world.inclub.wallet.bankAccountWithdrawal.application.service.StorageService;
import world.inclub.wallet.bankAccountWithdrawal.domain.entity.GeneralInformation;
import world.inclub.wallet.bankAccountWithdrawal.domain.entity.PositionDetails;
import world.inclub.wallet.bankAccountWithdrawal.domain.validator.GeneralValidatorBCP;
import world.inclub.wallet.bankAccountWithdrawal.infrastructure.filter.SolicitudeBankFilterFactory;
import world.inclub.wallet.infraestructure.serviceagent.service.interfaces.IAdminPanelService;


import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;


@Slf4j
@Service
@RequiredArgsConstructor
public class GeneralInformationServiceImpl implements GeneralInformationService {

        private final GeneralValidatorBCP generalValidatorBCP;
        private final ISolicitudeBankService solicitudeBankService;
        private final SolicitudeBankFilterFactory solicitudeBankFilterFactory;
        private final IAdminPanelService adminPanelService;
        private final SubscriptionProcessor subscriptionProcessor;
        private final GenerateMacroBCP generateMacroBCP;
        private final ExcelValidationProcessor excelValidationProcessor;
        private final AuditLogService auditLogService;
        private final StorageService storageService;

        @Override
        public Mono<ValidationResult> validate() {
                GeneralInformation generalInfo = GeneralInformation.builder()
                                .customerCode("000000")
                                .typeSpreadsheet("HABER")
                                .build();
                return Mono.fromSupplier(() -> generalValidatorBCP.validateGeneralInformation(generalInfo));
        }

        @Override
        public Mono<ValidationResult> validatePosition() {
                String today = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
                SolicitudeBankFilterDto filtro = solicitudeBankFilterFactory.buildInternalFilterBankPreAprove();

                return getExchangeRate()
                                .flatMap(exchangeRate -> solicitudeBankService.getPenndingAccountBankByIdUser(0, 1000, filtro)
                                                .flatMap(tuple -> tuple.getT1().collectList())
                                                .flatMap(lista -> subscriptionProcessor.processSubscriptions(lista, exchangeRate)
                                                                .map(result -> {
                                                                        PositionDetails details = subscriptionProcessor.buildPositionDetails(result, exchangeRate, today);
                                                                        log.info("PositionDetails construido: {}", details);
                                                                        ValidationResult validation = generalValidatorBCP.validatePosition(details);
                                                                        validation.setPositionDetails(details);
                                                                        validation.setData(result.getData());
                                                                        return validation;
                                                                })));
        }

        @Override
        public Mono<ValidationResult> validateDateSubscriptionRecive() {
                SolicitudeBankFilterDto filtroInterno = solicitudeBankFilterFactory.buildInternalFilter();
                return getExchangeRate()
                                .flatMap(exchangeRate -> solicitudeBankService.getPenndingAccountBankByIdUser(0, 1000, filtroInterno)
                                                .flatMap(tuple -> tuple.getT1().collectList())
                                                .flatMap(lista -> subscriptionProcessor.processSubscriptions(lista, exchangeRate)));
        }

        @Override
        public Mono<ValidationResult> validateDateSubscriptionPreAprove() {
                SolicitudeBankFilterDto filtro = solicitudeBankFilterFactory.buildInternalFilterBankPreAprove();

                return getExchangeRate()
                                .flatMap(exchangeRate -> solicitudeBankService.getPenndingAccountBankByIdUser(0, 1000, filtro)
                                                .flatMap(tuple -> tuple.getT1().collectList())
                                                .flatMap(lista -> subscriptionProcessor.processSubscriptions(lista, exchangeRate)));
        }

        @Override
        public Mono<CombinedValidationResult> validateAll(String username) {
                return Mono.zip(validate(), validatePosition(), validateDateSubscriptionRecive())
                                .map(tuple -> CombinedValidationResult.builder()
                                                .generalInformationResult(tuple.getT1())
                                                .positionDetailsResult(tuple.getT2())
                                                .dateSubscriptionResult(tuple.getT3())
                                                .allValid(tuple.getT1().isValid() && tuple.getT2().isValid() && tuple.getT3().isValid())
                                                .build())
                        .flatMap(result ->
                                auditLogService.saveType1(username, null,null, StatusReview.PRE_VALIDATED.getCode()).thenReturn(result)
                        );
        }

        @Override
        public Mono<CombinedValidationResult> validateAllPreAprove() {
                return Mono.zip(validate(), validatePosition(), validateDateSubscriptionPreAprove())
                                .map(tuple -> CombinedValidationResult.builder()
                                                .generalInformationResult(tuple.getT1())
                                                .positionDetailsResult(tuple.getT2())
                                                .dateSubscriptionResult(tuple.getT3())
                                                .allValid(tuple.getT1().isValid() && tuple.getT2().isValid() && tuple.getT3().isValid())
                                                .build());
        }

        private Mono<BigDecimal> getExchangeRate() {
                return adminPanelService.getTypeExchange()
                                .map(rate -> BigDecimal.valueOf(rate.getBuys()));
        }

    @Override
    public Mono<byte[]> generateMacroContent(String username) {
        String today = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));

        return validateDateSubscriptionPreAprove()
                .flatMap(result -> {
                    PositionDetails details = subscriptionProcessor.buildPositionDetails(result, BigDecimal.ONE, today);

                    List<SubscriptionValidationDto> correctos = (result.getData() != null && result.getData().getCorrectos() != null)
                            ? result.getData().getCorrectos()
                            : Collections.emptyList();

                    List<String> lineasDetalle = correctos.stream()
                            .map(generateMacroBCP::generarDetalleLine)
                            .toList();

                    return generateMacroBCP.generarCabecera(details, correctos)
                            .map(cabecera -> {
                                List<String> todasLineas = new ArrayList<>();
                                todasLineas.add(cabecera);
                                todasLineas.addAll(lineasDetalle);
                                String content = String.join("\r\n", todasLineas);
                                return Tuples.of(content, correctos);
                            });
                })
                .flatMap(tuple -> {
                    String content = tuple.getT1();
                    List<SubscriptionValidationDto> correctos = tuple.getT2();

                    byte[] bytes = content.getBytes(StandardCharsets.UTF_8);
                    String size = String.valueOf(bytes.length);
                    int recordsCount = correctos.size();

                    return storageService.uploadToS3("macro.txt", bytes, "32")
                            .flatMap(url -> {
                                return auditLogService.saveType2(username, null, url, StatusReview.DOWNLOAD_TXT.getCode(), recordsCount, size)
                                        .thenReturn(bytes);
                            });
                });
    }

        @Override
        public Mono<CombinedValidationResult> validateAllPreAproveAndGenerateExcel(String username) {
                return getExchangeRate()
                                .flatMap(exchangeRate -> runValidations(exchangeRate)
                                                .flatMap(result -> generateExcelIfValid(result, exchangeRate,username)));
        }

        private Mono<CombinedValidationResult> runValidations(BigDecimal exchangeRate) {
                return Mono.zip(validate(), validatePosition(), validateDateSubscriptionPreAprove())
                                .map(tuple -> CombinedValidationResult.builder()
                                                .generalInformationResult(tuple.getT1())
                                                .positionDetailsResult(tuple.getT2())
                                                .dateSubscriptionResult(tuple.getT3())
                                                .allValid(tuple.getT1().isValid()
                                                                && tuple.getT2().isValid()
                                                                && tuple.getT3().isValid())
                                                .build());
        }

    private Mono<CombinedValidationResult> generateExcelIfValid(CombinedValidationResult result, BigDecimal exchangeRate,String username) {
        if (!result.isAllValid()) {
            return Mono.just(result);
        }
        String today = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        PositionDetails details = subscriptionProcessor.buildPositionDetails(result.getPositionDetailsResult(), exchangeRate, today);

        List<SubscriptionValidationDto> correctos =
                (result.getDateSubscriptionResult().getData() != null && result.getDateSubscriptionResult().getData().getCorrectos() != null)
                        ? result.getDateSubscriptionResult().getData().getCorrectos()
                        : Collections.emptyList();

        return generateMacroContentBytes(details, correctos)
                .flatMap(bytes -> {
                    result.setExcelBytes(bytes);
                    String size = String.valueOf(bytes.length);
                    return storageService.uploadToS3("preapprove.xlsx", bytes, "32")
                            .flatMap(url -> {
                                log.info("Excel guardado en S3 con URL: {}", url);
                                return auditLogService.saveType2(username, null, url, StatusReview.DOWNLOAD_EXCEL.getCode(), correctos.size(), size
                                ).thenReturn(result);
                            });
                })
                .onErrorResume(e -> {
                    log.error("Error generando Excel", e);
                    result.setExcelBytes(new byte[0]);
                    return Mono.just(result);
                });
    }

        private Mono<byte[]> generateMacroContentBytes(PositionDetails details, List<SubscriptionValidationDto> correctos) {
                return generateMacroBCP.fillTemplateExcel(details, correctos);
        }

        @Override
        public Mono<ValidationResult> processExcel(FilePart filePart,String username) {
                log.info("GeneralInformationServiceImpl - Iniciando proceso de Excel");
                return excelValidationProcessor.processExcel(filePart,username);
        }
}