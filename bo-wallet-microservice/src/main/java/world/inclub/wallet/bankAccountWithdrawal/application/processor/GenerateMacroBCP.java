package world.inclub.wallet.bankAccountWithdrawal.application.processor;

import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.ss.usermodel.Row;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import world.inclub.wallet.bankAccountWithdrawal.application.dto.SubscriptionValidationDto;
import world.inclub.wallet.bankAccountWithdrawal.domain.entity.PositionDetails;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class GenerateMacroBCP {

    private String padLeft(String value, int length, char ch) {
        return String.format("%" + length + "s", value).replace(' ', ch);
    }

    private String padRight(String value, int length, char ch) {
        return String.format("%-" + length + "s", value).replace(' ', ch);
    }

    private String buildDocumentTypeFull(SubscriptionValidationDto dto) {
        return dto.getDocumentType() + dto.getDocumentNumber();
    }

    private String formatAmount(BigDecimal amount) {
        amount = amount.setScale(2, RoundingMode.DOWN);
        String integerPart = padLeft(amount.toBigInteger().toString(), 14, '0');
        String decimalPart = padLeft(amount.remainder(BigDecimal.ONE)
                .movePointRight(2)
                .toPlainString(), 2, '0');
        return integerPart + "." + decimalPart;
    }

    private String getCurrencyCode(String currencyType) {
        return switch (currencyType) {
            case "S" -> "0001";
            case "D" -> "0002";
            default -> "0000";
        };
    }

     // Calcula el Total Control sumando cargo y abonos
    public Mono<String> calculateTotalControl(String chargeAccount, List<SubscriptionValidationDto> detalles) {
        if (chargeAccount == null || chargeAccount.length() < 6) {
            return Mono.error(new IllegalArgumentException("chargeAccount demasiado corto: " + chargeAccount));
        }

        String cargoSubstring = chargeAccount.substring(3, chargeAccount.length() - 3);
        BigDecimal totalCargo;
        try {
            totalCargo = new BigDecimal(cargoSubstring);
        } catch (NumberFormatException e) {
            return Mono.error(new IllegalArgumentException("El substring de la cuenta no es un número válido: '" + cargoSubstring + "'", e));
        }

        BigDecimal totalAbonos = detalles.stream()
                .map(dto -> {
                    try {
                        return new BigDecimal(dto.getSubscriptionAmount());
                    } catch (NumberFormatException e) {
                        log.warn("Monto inválido en detalle: {}", dto.getSubscriptionAmount());
                        return BigDecimal.ZERO;
                    }
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalControl = totalCargo.add(totalAbonos);
        String totalControlStr = padLeft(totalControl.setScale(2, RoundingMode.DOWN)
                .toPlainString()
                .replace(".", ""), 15, '0');

        return Mono.just(totalControlStr);
    }

     //Genera la línea de cabecera
    public Mono<String> generarCabecera(PositionDetails details, List<SubscriptionValidationDto> detalles) {
        return calculateTotalControl(details.getChargeAccount(), detalles)
                .map(totalControl -> {
                    BigDecimal totalPayroll = new BigDecimal(details.getTotalPayrollAmount())
                            .setScale(2, RoundingMode.DOWN);
                    String totalPayrollFormatted = padLeft(totalPayroll.toPlainString(), 17, '0');

                    String numberOfPayments = padLeft(details.getNumberOfPayments(), 6, '0');

                    String chargeAccountFormatted = padRight(
                            details.getChargeAccountType() + "0001" + details.getChargeAccount(), 20, ' ');

                    return "1" +
                            numberOfPayments +
                            details.getProcessDate() +
                            details.getPayrollSubtype() +
                            chargeAccountFormatted +
                            totalPayrollFormatted +
                            padRight(details.getPayrollReference(), 40, ' ') +
                            totalControl;
                });
    }

     // Genera una línea de detalle
    public String generarDetalleLine(SubscriptionValidationDto dto) {
        String documentTypeFull = buildDocumentTypeFull(dto);
        String montoFormateado = formatAmount(new BigDecimal(dto.getSubscriptionAmount()));
        String currencyCode = getCurrencyCode(dto.getCurrencyType());

        return "2A" +
                padRight(dto.getSubscriptionAccount(), 15, ' ') +
                padRight(documentTypeFull, 15, ' ') +
                padRight(dto.getWorkerName(), 60, ' ') +
                padRight("Referencia Beneficiario " + dto.getDocumentNumber(), 40, ' ') +
                padRight("Ref Emp " + dto.getDocumentNumber(), 20, ' ') +
                currencyCode +
                montoFormateado +
                dto.getCurrencyType();
    }

    public Mono<byte[]> fillTemplateExcel(PositionDetails details, List<SubscriptionValidationDto> correctos) {
        return Mono.fromCallable(() -> {
            try (
                    InputStream is = getClass().getResourceAsStream("/templates/bcp.xlsm");
                    OPCPackage pkg = OPCPackage.open(is);
                    Workbook workbook = new XSSFWorkbook(pkg);
                    ByteArrayOutputStream out = new ByteArrayOutputStream()
            ) {
                Sheet sheet = workbook.getSheetAt(0);
                //  Sección: Datos del cargo (fila 7 → índice 6)
                writeCargoRow(sheet, details);
                //  Sección: Datos de abonos (fila 11 → índice 10)
                writeAbonoRows(sheet, correctos, 10);
                workbook.write(out);
                return out.toByteArray();
            } catch (Exception e) {
                log.error(" Error al llenar plantilla Excel", e);
                throw new RuntimeException("Error al llenar plantilla Excel", e);
            }
        });
    }

    // Escribe los datos generales de cargo en la fila 7 (índice 6).
    private void writeCargoRow(Sheet sheet, PositionDetails details) {
        Row row = getOrCreateRow(sheet, 6);

        row.createCell(0).setCellValue(details.getTypeRecord());        // A
        row.createCell(1).setCellValue(details.getNumberOfPayments());  // B
        row.createCell(2).setCellValue(details.getProcessDate());       // C
        row.createCell(3).setCellValue(details.getPayrollSubtype());    // D
        row.createCell(4).setCellValue(details.getChargeAccountType()); // E
        row.createCell(5).setCellValue(details.getChargeAccount());     // F
        row.createCell(6).setCellValue(details.getTotalPayrollAmount());// G
        row.createCell(7).setCellValue(details.getPayrollReference());  // H
    }

     // Escribe los registros de abono desde la fila indicada.
    private void writeAbonoRows(Sheet sheet, List<SubscriptionValidationDto> correctos, int startRow) {
        for (int i = 0; i < correctos.size(); i++) {
            SubscriptionValidationDto dto = correctos.get(i);
            Row row = getOrCreateRow(sheet, startRow + i);

            row.createCell(0).setCellValue(dto.getRecordType());              // Tipo de registro
            row.createCell(1).setCellValue(dto.getSubscriptionAccountType()); // Tipo cuenta abono
            row.createCell(2).setCellValue(dto.getSubscriptionAccount());     // Cuenta abono
            row.createCell(3).setCellValue(dto.getDocumentType());            // Tipo documento
            row.createCell(4).setCellValue(dto.getDocumentNumber());          // Número documento
            row.createCell(5).setCellValue(dto.getWorkerName());              // Nombre trabajador
            row.createCell(6).setCellValue(dto.getCurrencyType());            // Tipo moneda
            row.createCell(7).setCellValue(dto.getSubscriptionAmount());      // Monto abono
            row.createCell(8).setCellValue(dto.getSupplierValidation());      // Validación IDC
        }
    }

    // Devuelve la fila en el índice, o la crea si no existe.
    private Row getOrCreateRow(Sheet sheet, int rowIndex) {
        Row row = sheet.getRow(rowIndex);
        return (row != null) ? row : sheet.createRow(rowIndex);
    }
}