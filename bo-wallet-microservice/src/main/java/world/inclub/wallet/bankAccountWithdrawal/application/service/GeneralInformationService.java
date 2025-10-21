package world.inclub.wallet.bankAccountWithdrawal.application.service;

import org.springframework.http.codec.multipart.FilePart;
import reactor.core.publisher.Mono;
import world.inclub.wallet.bankAccountWithdrawal.application.dto.AccountValidation;
import world.inclub.wallet.bankAccountWithdrawal.application.dto.BankAccountDTO;
import world.inclub.wallet.bankAccountWithdrawal.application.dto.CombinedValidationResult;
import world.inclub.wallet.bankAccountWithdrawal.application.dto.ValidationResult;
import world.inclub.wallet.bankAccountWithdrawal.domain.entity.BankAccount;
import world.inclub.wallet.infraestructure.serviceagent.dtos.response.AccountBankByClientResponse;
import world.inclub.wallet.infraestructure.serviceagent.dtos.response.AccountBankResponse;

import java.util.List;

public interface GeneralInformationService {
    Mono<ValidationResult> validate();
    Mono<ValidationResult> validatePosition();
    Mono<ValidationResult> validateDateSubscriptionRecive();
    Mono<ValidationResult> validateDateSubscriptionPreAprove();
    Mono<CombinedValidationResult> validateAll(String username);
    Mono<CombinedValidationResult> validateAllPreAprove();
    Mono<byte[]> generateMacroContent(String username);
    Mono<CombinedValidationResult> validateAllPreAproveAndGenerateExcel(String username);
    Mono<ValidationResult> processExcel(FilePart filePart,String username);
}