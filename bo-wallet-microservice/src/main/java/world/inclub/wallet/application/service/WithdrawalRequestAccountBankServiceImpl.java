package world.inclub.wallet.application.service;

import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Service;

import io.github.resilience4j.circuitbreaker.CallNotPermittedException;
import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import io.github.resilience4j.reactor.circuitbreaker.operator.CircuitBreakerOperator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.api.dtos.response.WithDrawalRequestAccountBankResponseDTO;
import world.inclub.wallet.application.service.interfaces.IWalletTransactionService;
import world.inclub.wallet.application.service.interfaces.IWithdrawalRequestAccountBankService;
import world.inclub.wallet.domain.constant.FolderNumbers;
import world.inclub.wallet.domain.entity.WalletTransaction;
import world.inclub.wallet.domain.entity.WithDrawalRequestAccountBank;
import world.inclub.wallet.domain.enums.CodeRequestStates;
import world.inclub.wallet.domain.enums.CodeTypeWalletTransaction;
import world.inclub.wallet.domain.enums.Currency;
import world.inclub.wallet.domain.port.IAccountBankPort;
import world.inclub.wallet.domain.port.IWithDrawalRequestAccountBankPort;
import world.inclub.wallet.infraestructure.exception.common.ResourceNotFoundException;
import world.inclub.wallet.infraestructure.serviceagent.service.DocumentService;

@Service
@Slf4j
@RequiredArgsConstructor
public class WithdrawalRequestAccountBankServiceImpl implements IWithdrawalRequestAccountBankService {

    private final IAccountBankPort iAccountBankPort;
    private final IWithDrawalRequestAccountBankPort iWithDrawalRequestAccountBankPort;
    private final IWalletTransactionService iWalletTransactionService;
    private final DocumentService iDocumentService;
    private final CircuitBreakerRegistry circuitBreakerRegistry;

    @Override
    public Mono<Boolean> generateWithDrawalRequestAccountBank(WalletTransaction walletTransaction, int idUser,
            Long idAccountBank, Mono<FilePart> file, String description) {

        // var conciliationPending =
        // _unitOfWork.IConciliationRepository.getConciliationPendingByUser(idUser);
        // if (conciliationPending.Count > 0) throw new InvalidOperationException("Tiene
        // conciliaciones pendientes");
        CircuitBreaker circuitBreaker = circuitBreakerRegistry.circuitBreaker("generateWithDrawalRequestAccountBank");

        return iAccountBankPort.getAccountBankById(idAccountBank).flatMap(a -> {
            if (a.getIdUser() == idUser) {

                if (walletTransaction.getIdTypeWalletTransaction() == CodeTypeWalletTransaction.RETIRO.getValue()) {
                    walletTransaction.setReferenceData("Retiro de fondos");
                } else {
                    walletTransaction.setIdTypeWalletTransaction(1);
                    walletTransaction.setReferenceData("Retiro de fondos de Marcas Exclusivas");
                }

                return iWalletTransactionService.registerTransaction(walletTransaction, idUser).flatMap(transaction -> {
                    if (transaction != null) {

                        Integer idRequestStates = CodeRequestStates.Enviado.getValue();
                        Integer idCurrency = Currency.Dolar.getValue(); // las solicitudes por el momento serán en
                                                                        // dólares

                        return iDocumentService.postDataToExternalAPI(file, FolderNumbers.DOCUMENT_LEGAL)
                                .flatMap(imgUrl -> {
                                    WithDrawalRequestAccountBank wDrawalRequestAccountBank = new WithDrawalRequestAccountBank(
                                            transaction.getIdWalletTransaction().intValue(),
                                            a.getIdAccountBank().intValue(), idRequestStates, idCurrency, imgUrl,
                                            description);
                                            return iWithDrawalRequestAccountBankPort.saveWDRAccountBank(wDrawalRequestAccountBank).flatMap(result -> {
                                                log.info("Valores guardados WAccountBank: " + result);
                                                return Mono.just(true);
                                            });
                                    
                                });

                    } else {
                        return Mono.error(new ResourceNotFoundException("Error en el registro de la transacción"));
                    }
                });
            } else {
                return Mono.error(new ResourceNotFoundException("AccountBank not found for id: " + idAccountBank));
            }

        }).transformDeferred(CircuitBreakerOperator.of(circuitBreaker))
                .doOnError(CallNotPermittedException.class, e -> {
                    log.error("Circuit Breaker is open. Fallback logic here.");
                    throw new RuntimeException( "API service is unavailable");

                });

    }

    @Override
    public Flux<WithDrawalRequestAccountBankResponseDTO> getWDRAccountBankByIdUser(Integer idUser) {
        return iWithDrawalRequestAccountBankPort.getWDRAccountBankByIdUser(idUser);
    }

}
