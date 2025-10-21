package world.inclub.wallet.bankAccountWithdrawal.infrastructure.adapter;


import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Component;
import org.apache.poi.ss.usermodel.Row;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
import world.inclub.wallet.api.dtos.SolicitudeBankFilterDto;
import world.inclub.wallet.application.service.interfaces.ISolicitudeBankService;
import world.inclub.wallet.bankAccountWithdrawal.domain.entity.BankAccount;
import world.inclub.wallet.bankAccountWithdrawal.domain.port.ExcelReaderPort;
import world.inclub.wallet.bankAccountWithdrawal.infrastructure.filter.SolicitudeBankFilterFactory;
import world.inclub.wallet.infraestructure.kafka.dtos.response.SolicitudeBankDto;
import world.inclub.wallet.infraestructure.serviceagent.dtos.AccountBankRequestDTO;
import world.inclub.wallet.infraestructure.serviceagent.dtos.response.AccountBankByClientResponse;
import world.inclub.wallet.infraestructure.serviceagent.service.AccountService;

import org.springframework.core.io.buffer.DataBuffer;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@AllArgsConstructor
@Component
public class iExcelReaderBCPAdapter implements ExcelReaderPort {

    private final AccountService accountService;
    private final ISolicitudeBankService solicitudeBankService;
    private final SolicitudeBankFilterFactory solicitudeBankFilterFactory;


    @Override
    public Mono<List<BankAccount>> readExcel(FilePart filePart) {
        return filePart.content()
                .map(this::toBytes)
                .reduce(this::concatBytes)
                .flatMap(this::parseExcel)
                .doOnSuccess(list -> log.info("Excel leído: {} registros", list.size()))
                .doOnError(e -> log.error("Error leyendo Excel: {}", e.getMessage()));
    }

    private byte[] toBytes(DataBuffer dataBuffer) {
        byte[] bytes = new byte[dataBuffer.readableByteCount()];
        dataBuffer.read(bytes);
        return bytes;
    }

    private byte[] concatBytes(byte[] acc, byte[] current) {
        byte[] result = new byte[acc.length + current.length];
        System.arraycopy(acc, 0, result, 0, acc.length);
        System.arraycopy(current, 0, result, acc.length, current.length);
        return result;
    }

    private Mono<List<BankAccount>> parseExcel(byte[] bytes) {
        return Mono.fromCallable(() -> {
            List<BankAccount> accounts = new ArrayList<>();
            try (InputStream is = new ByteArrayInputStream(bytes);
                 Workbook workbook = new XSSFWorkbook(is)) {

                Sheet sheet = workbook.getSheetAt(0);

                for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                    Row row = sheet.getRow(i);
                    if (row == null) continue;

                    accounts.add(BankAccount.builder()
                            .fullName(getCellValue(row, 1))
                            .numDocument(getCellValue(row, 2).replaceAll("[^0-9]", ""))
                            .numberAccount(getCellValue(row, 5).replaceAll("[^0-9]", ""))
                            .estado(getCellValue(row, 11))
                            .build());
                }
            }
            return accounts;
        }).subscribeOn(Schedulers.boundedElastic());
    }

    private String getCellValue(Row row, int index) {
        Cell cell = row.getCell(index);
        if (cell == null) return "";
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue().trim();
            case NUMERIC -> String.valueOf((long) cell.getNumericCellValue());
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            default -> "";
        };
    }


    @Override
    public Mono<List<AccountBankByClientResponse>> searchAccounts(AccountBankRequestDTO request) {
        return accountService.searchAccountBankList(request);
    }

    @Override
    public Mono<List<SolicitudeBankDto>> getPendingAccounts(SolicitudeBankFilterDto filter) {
        filter = solicitudeBankFilterFactory.buildInternalFilterBankPreAprove();
        return solicitudeBankService.getPenndingAccountBankByIdUser(0, 10000, filter)
                .flatMap(tuple -> tuple.getT1().collectList());
    }

    @Override
    public Mono<Boolean> updateBankStatuses(List<Long> ids, Integer estado) {
        return solicitudeBankService.updateBankStatusOnly(ids, estado);
    }
}
