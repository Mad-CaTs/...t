package world.inclub.wallet.bankAccountWithdrawal.domain.validator;

import org.springframework.stereotype.Component;
import world.inclub.wallet.bankAccountWithdrawal.application.dto.SubscriptionValidationDto;
import world.inclub.wallet.bankAccountWithdrawal.application.dto.SubscriptionValidationError;
import world.inclub.wallet.bankAccountWithdrawal.application.dto.SubscriptionValidationSummary;
import world.inclub.wallet.bankAccountWithdrawal.application.dto.ValidationResult;
import world.inclub.wallet.bankAccountWithdrawal.domain.entity.GeneralInformation;
import world.inclub.wallet.bankAccountWithdrawal.domain.entity.PositionDetails;

import java.util.*;

@Component
public class GeneralValidatorBCP {

    public ValidationResult validateGeneralInformation(GeneralInformation datos) {
        List<String> errors = new ArrayList<>();
        if (datos.getCustomerCode() == null || !datos.getCustomerCode().matches("^[A-Za-z0-9]{6}$")) {
            errors.add("El código de cliente debe tener 6 caracteres alfanuméricos.");
        }
        if (!"HABER".equalsIgnoreCase(datos.getTypeSpreadsheet())) {
            errors.add("El tipo de plantilla debe ser HABER.");
        }
        return new ValidationResult(errors.isEmpty(), errors, null,null,null, null, null, null);
    }

    public ValidationResult validatePosition(PositionDetails datos) {
        List<String> errors = new ArrayList<>();

        // Tipo de Registro
        if (!"C".equalsIgnoreCase(datos.getTypeRecord())) {
            errors.add("El tipo de registro debe ser 'C' (Cargo).");
        }

        // Cantidad de abonos
        if (datos.getNumberOfPayments() == null || !datos.getNumberOfPayments().matches("^\\d{6}$")) {
            errors.add("La cantidad de abonos debe ser numérica de 6 dígitos.");
        }

        // Fecha de proceso
        if (datos.getProcessDate() == null || !datos.getProcessDate().matches("^\\d{8}$")) {
            errors.add("La fecha de proceso debe tener formato AAAAMMDD (8 dígitos).");
        }

        // Subtipo de planilla
        if (!"O".equalsIgnoreCase(datos.getPayrollSubtype())) {
            errors.add("El subtipo de planilla debe ser 'O' (Otros).");
        }

        // Tipo de cuenta de cargo
        if (datos.getChargeAccountType() == null || !datos.getChargeAccountType().matches("^[CM]$")) {
            errors.add("El tipo de cuenta de cargo debe ser 'C' (Corriente) o 'M' (Maestra).");
        }

        // Cuenta de cargo
        if (datos.getChargeAccount() == null || !datos.getChargeAccount().matches("^[A-Za-z0-9]{13}$")) {
            errors.add("La cuenta de cargo debe ser alfanumérica de 13 caracteres.");
        }

        // Monto total de planilla
        if (datos.getTotalPayrollAmount() == null ||
                !datos.getTotalPayrollAmount().matches("^\\d{1,14}(\\.\\d{1,2})?$")) {
            errors.add("El monto total de la planilla debe ser numérico (hasta 14 enteros y 2 decimales).");
        }

        // Referencia de planilla
        if (datos.getPayrollReference() == null || datos.getPayrollReference().isEmpty()) {
            errors.add("La referencia de la planilla no puede estar vacía (default 'Referencia Retiro').");
        }

        return new ValidationResult(errors.isEmpty(), errors,null,null,null, null, null, datos);
    }

    public ValidationResult validateSubscription(SubscriptionValidationDto datos) {
        List<String> errors = new ArrayList<>();

        // Tipo de registro
        if (!"A".equalsIgnoreCase(datos.getRecordType())) {
            errors.add("El tipo de registro debe ser 'A' (Abono).");
        }

        // Tipo de cuenta de abono
        if (datos.getSubscriptionAccountType() == null || !datos.getSubscriptionAccountType().matches("^[CMAB]$")) {
            errors.add("El tipo de cuenta de abono debe ser C, M, A o B.");
        }

        // Cuenta de abono según tipo
        if ("C".equalsIgnoreCase(datos.getSubscriptionAccountType()) || "M".equalsIgnoreCase(datos.getSubscriptionAccountType())) {
            if (!datos.getSubscriptionAccount().matches("^[A-Za-z0-9]{13}$")) {
                errors.add("La cuenta de abono Corriente/Maestra debe tener 13 caracteres alfanuméricos.");
            }else {
                // últimos 3 dígitos deben empezar con 0 o 1
                String ultimos3 = datos.getSubscriptionAccount()
                        .substring(datos.getSubscriptionAccount().length() - 3);
                char antepenultimo = ultimos3.charAt(0);
                if (antepenultimo != '0' && antepenultimo != '1') {
                    errors.add("Cuenta C/M inválida: los últimos 3 dígitos deben iniciar en 0 o 1 (" + ultimos3 + ").");
                }
            }
        } else if ("A".equalsIgnoreCase(datos.getSubscriptionAccountType())) {
            if (!datos.getSubscriptionAccount().matches("^[A-Za-z0-9]{14}$")) {
                errors.add("La cuenta de abono Ahorros debe tener 14 caracteres alfanuméricos.");
            } // últimos 3 dígitos
            String ultimos3 = datos.getSubscriptionAccount()
                    .substring(datos.getSubscriptionAccount().length() - 3);
            // antepenúltimo (primer dígito de esos 3)
            char antepenultimo = ultimos3.charAt(0);
            if (antepenultimo != '0' && antepenultimo != '1') {
                errors.add("Cuenta A inválida: el antepenúltimo dígito debe ser 0 o 1 (últimos3=" + ultimos3 + ").");
            }
        } else if ("B".equalsIgnoreCase(datos.getSubscriptionAccountType())) {
            if (!datos.getSubscriptionAccount().matches("^[A-Za-z0-9]{20}$")) {
                errors.add("La cuenta de abono Interbancaria debe tener 20 caracteres alfanuméricos.");
            }
        }

        // Documento de identidad
        switch (datos.getDocumentType()) {
            case "1": // DNI
                if (!datos.getDocumentNumber().matches("^\\d{8}$")) {
                    errors.add("El DNI debe ser numérico de 8 dígitos.");
                }
                break;
            case "3": // Carnet extranjería
            case "4": // Pasaporte
                if (!datos.getDocumentNumber().matches("^[A-Za-z0-9]{1,12}$")) {
                    errors.add("El documento CE/Pasaporte debe ser alfanumérico de hasta 12 caracteres.");
                }
                break;
            case "RUC":
                if (!datos.getDocumentNumber().matches("^\\d{11}$")) {
                    errors.add("El RUC debe ser numérico de 11 dígitos.");
                }
                break;
            case "FIC":
                if (!datos.getDocumentNumber().matches("^\\d{1,12}$")) {
                    errors.add("El FIC debe ser numérico de hasta 12 dígitos.");
                }
                break;
            default:
                errors.add("El tipo de documento es inválido.");
        }

        // Nombre trabajador
        if (datos.getWorkerName() == null || datos.getWorkerName().length() > 75) {
            errors.add("El nombre del trabajador no puede superar los 75 caracteres.");
        }

        // Tipo de moneda
        if (!"S".equalsIgnoreCase(datos.getCurrencyType()) && !"D".equalsIgnoreCase(datos.getCurrencyType())) {
            errors.add("El tipo de moneda debe ser 'S' (Soles) o 'D' (Dólares).");
        }

        // Monto de abono
        if (datos.getSubscriptionAmount() == null || !datos.getSubscriptionAmount().matches("^\\d{1,14}(\\.\\d{1,2})?$")) {
            errors.add("El monto de abono debe ser numérico (hasta 14 enteros y 2 decimales).");
        }

        // Validación proveedor vs cuenta
        if (!"S".equalsIgnoreCase(datos.getSupplierValidation())) {
            errors.add("La validación proveedor vs cuenta debe ser 'S'.");
        }

        return new ValidationResult(errors.isEmpty(), null, errors,null,null,null, null, null);
    }


    public ValidationResult validateSubscriptions(List<SubscriptionValidationDto> lista) {
        List<SubscriptionValidationDto> correctos = new ArrayList<>();
        List<SubscriptionValidationError> incorrectos = new ArrayList<>();

        for (SubscriptionValidationDto dto : lista) {
            ValidationResult vr = validateSubscription(dto);
            if (vr.isValid()) {
                correctos.add(dto);
            } else {
                incorrectos.add(
                        SubscriptionValidationError.builder()
                                .registro(dto)
                                .errores(vr.getErrors())
                                .build()
                );
            }
        }
        SubscriptionValidationSummary summary = SubscriptionValidationSummary.builder()
                .totalRegistros(lista.size())
                .cantidadCorrectos(correctos.size())
                .cantidadIncorrectos(incorrectos.size())
                .correctos(correctos)
                .incorrectos(incorrectos)
                .build();

        return ValidationResult.builder()
                .valid(incorrectos.isEmpty())
                .message("Pre-Validación completada: " + correctos.size() +
                        " correctos, " + incorrectos.size() + " incorrectos.")
                .data(summary)
                .build();
    }
}