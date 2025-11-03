package world.inclub.wallet.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellReference;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import world.inclub.wallet.application.service.interfaces.WalletExcelReportService;
import world.inclub.wallet.infraestructure.serviceagent.dtos.response.UserWalletDataResponse;
import world.inclub.wallet.infraestructure.serviceagent.dtos.response.WalletTransactionResponse;

import java.io.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class WalletExcelReportServiceImpl implements WalletExcelReportService {

    private static final String TEMPLATE_PATH = "templates/Historiacal-Movement-Portfolio.xlsx";
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    @Override
    public ByteArrayInputStream generateWalletReport(UserWalletDataResponse data) {
        try (
                InputStream fis = new ClassPathResource(TEMPLATE_PATH).getInputStream();
                Workbook workbook = new XSSFWorkbook(fis);
                ByteArrayOutputStream out = new ByteArrayOutputStream()
        ) {
            Sheet sheet = workbook.getSheetAt(0);

            writeUserData(sheet, data);
            writeWalletData(sheet, data);

            CellStyle centeredBordered = createCenteredBorderedStyle(workbook);
            CellStyle amountPositiveStyle = createAmountStyle(workbook, IndexedColors.BLACK, IndexedColors.LIGHT_TURQUOISE);
            CellStyle amountNegativeStyle = createAmountStyle(workbook, IndexedColors.RED, IndexedColors.LEMON_CHIFFON);

            int startRow = 12;
            int counter = 1;

            for (WalletTransactionResponse tx : data.getTransactions()) {
                BigDecimal amount = tx.getAmount();
                boolean isNegative = amount.compareTo(BigDecimal.ZERO) < 0;

                CellStyle rowStyle = workbook.createCellStyle();
                rowStyle.cloneStyleFrom(centeredBordered);
                rowStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
                rowStyle.setFillForegroundColor(
                        isNegative ? IndexedColors.LEMON_CHIFFON.getIndex() : IndexedColors.LIGHT_TURQUOISE.getIndex()
                );

                Row row = sheet.createRow(startRow++);
                createStyledCell(row, 0, counter++, rowStyle);
                createStyledCell(row, 1, tx.getIdWalletTransaction(), rowStyle);
                createStyledCell(row, 2, formatDate(tx.getInitialDate()), rowStyle);

                Cell cellAmount = row.createCell(3);
                cellAmount.setCellValue(amount.doubleValue());
                cellAmount.setCellStyle(isNegative ? amountNegativeStyle : amountPositiveStyle);

                createStyledCell(row, 4, tx.getReferenceData(), rowStyle);
                createStyledCell(row, 5, tx.getTypeDescription(), rowStyle);
            }

            BigDecimal totalMovimientos = data.getTransactions().stream()
                    .map(WalletTransactionResponse::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal saldoDisponible = data.getWallet().getAvailableBalance();
            BigDecimal diferencia = saldoDisponible.subtract(totalMovimientos);

            setCellValue(sheet, "J5", totalMovimientos);
            setCellValue(sheet, "J6", totalMovimientos);
            setCellValue(sheet, "J7", diferencia);

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());

        } catch (FileNotFoundException e) {
            log.error("No se encontró la plantilla Excel: {}", TEMPLATE_PATH);
            throw new RuntimeException("No se encontró la plantilla Excel en resources/templates", e);
        } catch (Exception e) {
            log.error("Error generando el reporte Excel: {}", e.getMessage(), e);
            throw new RuntimeException("Error generando Excel de Wallet", e);
        }
    }

    private void writeUserData(Sheet sheet, UserWalletDataResponse data) {
        setCellValue(sheet, "B3", data.getUserAccount().getName());
        setCellValue(sheet, "C3", data.getUserAccount().getLastName());
        setCellValue(sheet, "D3", data.getUserAccount().getUsername());
    }

    private void writeWalletData(Sheet sheet, UserWalletDataResponse data) {
        setCellValue(sheet, "H3", data.getWallet().getIdWallet());
        setCellValue(sheet, "I3", data.getWallet().getAvailableBalance());
        setCellValue(sheet, "J3", data.getWallet().getAccountingBalance());
    }

    private void setCellValue(Sheet sheet, String cellRef, Object value) {
        CellReference ref = new CellReference(cellRef);
        Row row = sheet.getRow(ref.getRow());
        if (row == null) row = sheet.createRow(ref.getRow());
        Cell cell = row.getCell(ref.getCol());
        if (cell == null) cell = row.createCell(ref.getCol());
        applyValue(cell, value);
    }

    private void createStyledCell(Row row, int colIndex, Object value, CellStyle style) {
        Cell cell = row.createCell(colIndex);
        applyValue(cell, value);
        cell.setCellStyle(style);
    }

    private void applyValue(Cell cell, Object value) {
        if (value instanceof Number num) cell.setCellValue(num.doubleValue());
        else cell.setCellValue(String.valueOf(value));
    }

    private CellStyle createCenteredBorderedStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        setBorders(style);
        return style;
    }

    private CellStyle createAmountStyle(Workbook workbook, IndexedColors fontColor, IndexedColors bgColor) {
        CellStyle style = createCenteredBorderedStyle(workbook);
        Font font = workbook.createFont();
        font.setBold(true);
        font.setColor(fontColor.getIndex());
        style.setFont(font);
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setFillForegroundColor(bgColor.getIndex());
        return style;
    }

    private void setBorders(CellStyle style) {
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
    }

    private String formatDate(Object initialDate) {
        try {
            if (initialDate instanceof List<?> list && list.size() >= 3) {
                int year = ((Number) list.get(0)).intValue();
                int month = ((Number) list.get(1)).intValue();
                int day = ((Number) list.get(2)).intValue();
                int hour = list.size() > 3 ? ((Number) list.get(3)).intValue() : 0;
                int minute = list.size() > 4 ? ((Number) list.get(4)).intValue() : 0;
                return LocalDateTime.of(year, month, day, hour, minute).format(DATE_FORMATTER);
            }

            if (initialDate instanceof String str && str.contains("T")) {
                return LocalDateTime.parse(str).format(DATE_FORMATTER);
            }

            if (initialDate instanceof LocalDateTime dateTime) {
                return dateTime.format(DATE_FORMATTER);
            }
        } catch (Exception e) {
            log.warn("No se pudo formatear la fecha: {}", initialDate);
        }
        return initialDate != null ? initialDate.toString() : "";
    }
}