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
import world.inclub.wallet.api.dtos.response.WithDrawalRequestElectronicPurseResponseDTO;
import world.inclub.wallet.application.service.interfaces.IWalletTransactionService;
import world.inclub.wallet.application.service.interfaces.IWithdrawalRequestElectronicPurseService;
import world.inclub.wallet.domain.constant.FolderNumbers;
import world.inclub.wallet.domain.entity.WalletTransaction;
import world.inclub.wallet.domain.entity.WithDrawalRequestElectronicPurse;
import world.inclub.wallet.domain.enums.CodeRequestStates;
import world.inclub.wallet.domain.enums.Currency;
import world.inclub.wallet.domain.enums.CodeTypeWalletTransaction;
import world.inclub.wallet.domain.port.IElectronicPursePort;
import world.inclub.wallet.domain.port.IWithDrawalRequestElectronicPursePort;
import world.inclub.wallet.infraestructure.exception.common.ResourceNotFoundException;
import world.inclub.wallet.infraestructure.serviceagent.service.DocumentService;

@Service
@Slf4j
@RequiredArgsConstructor
public class WithdrawalRequestElectronicPurseServiceImpl implements IWithdrawalRequestElectronicPurseService {

    private final IElectronicPursePort iElectronicPursePort;
    private final IWalletTransactionService iWalletTransactionService;
    private final DocumentService iDocumentService;
    private final IWithDrawalRequestElectronicPursePort iWithDrawalRequestElectronicPursePort;
    private final CircuitBreakerRegistry circuitBreakerRegistry;

    @Override
    public Mono<Boolean> generateWithdrawalRequestElectronicPurse(WalletTransaction walletTransaction, int idUser,
            Long idElectronecPurse, Mono<FilePart> file, String description) {

        // var conciliationPending =
        // _unitOfWork.IConciliationRepository.getConciliationPendingByUser(idUser);
        // if (conciliationPending.Count > 0) throw new InvalidOperationException("Tiene
        // conciliaciones pendientes");

        CircuitBreaker circuitBreaker = circuitBreakerRegistry
                .circuitBreaker("generateWithdrawalRequestElectronicPurse");

        return iElectronicPursePort.getElectronicPurseById(idElectronecPurse).flatMap(e -> {
            if (e.getIdUser().intValue() == idUser) {

                // Set de valores en WalletTransaction Pendiente de Pulir
                walletTransaction.setIdTypeWalletTransaction(CodeTypeWalletTransaction.RETIRO.getValue());
                walletTransaction.setReferenceData("Retiro de fondos");

                return iWalletTransactionService.registerTransaction(walletTransaction, idUser).flatMap(transaction -> {
                    if (transaction != null) {

                        Integer idRequestStates = CodeRequestStates.Enviado.getValue();
                        Integer idCurrency = Currency.Dolar.getValue(); // las solicitudes por el momento serán en
                                                                        // dólares

                        return iDocumentService.postDataToExternalAPI(file,
                                FolderNumbers.DOCUMENT_LEGAL).flatMap(imgUrl -> {

                                    WithDrawalRequestElectronicPurse WDRElectronicPurse = new WithDrawalRequestElectronicPurse(
                                            transaction.getIdWalletTransaction().intValue(),
                                            e.getIdElectronicPurse().intValue(),
                                            idRequestStates, idCurrency, imgUrl, description);
                                    return iWithDrawalRequestElectronicPursePort
                                            .saveWDRElectrinicPurse(WDRElectronicPurse).flatMap(result -> {
                                                log.info("Valores guardados WElectronicPurse: " + result);
                                                return Mono.just(true);
                                            });

                                });

                    } else {
                        return Mono.error(new ResourceNotFoundException("Error en el registro de la transacción"));
                    }
                });

            } else {
                return Mono
                        .error(new ResourceNotFoundException("ElectronicPurse not found for id: " + idElectronecPurse));
            }

        }).switchIfEmpty(
                Mono.error(new ResourceNotFoundException("ElectronicPurse not found for id: " + idElectronecPurse)))
                .transformDeferred(CircuitBreakerOperator.of(circuitBreaker))
                .doOnError(CallNotPermittedException.class, e -> {
                    log.error("Circuit Breaker is open. Fallback logic here.");
                    throw new RuntimeException("API service is unavailable");

                });

    }

    @Override
    public Flux<WithDrawalRequestElectronicPurseResponseDTO> getWDRElectronicPurseByIdUser(Integer idUser) {
        return iWithDrawalRequestElectronicPursePort.getWDRElectronicPurseByIdUser(idUser);
    }

}
