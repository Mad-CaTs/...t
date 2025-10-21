package world.inclub.wallet.application.service;

import io.github.resilience4j.circuitbreaker.CallNotPermittedException;
import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import io.github.resilience4j.reactor.circuitbreaker.operator.CircuitBreakerOperator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.util.function.Tuple2;
import reactor.util.function.Tuples;
import world.inclub.wallet.api.dtos.*;
import world.inclub.wallet.api.dtos.response.SponsorResponse;
import world.inclub.wallet.api.dtos.response.UserResponse;
import world.inclub.wallet.api.mapper.UserMapper;
import world.inclub.wallet.application.service.interfaces.ITokenWalletTransactionService;
import world.inclub.wallet.application.service.interfaces.ITypeWalletTransactionService;
import world.inclub.wallet.application.service.interfaces.IWalletService;
import world.inclub.wallet.application.service.interfaces.IWalletTransactionService;
import world.inclub.wallet.domain.dictionary.DictionaryData;
import world.inclub.wallet.domain.entity.TransactionPaypal;
import world.inclub.wallet.domain.entity.TypeWalletTransaction;
import world.inclub.wallet.domain.entity.Wallet;
import world.inclub.wallet.domain.entity.WalletTransaction;
import world.inclub.wallet.domain.enums.*;
import world.inclub.wallet.domain.port.ITransactionPaypalPort;
import world.inclub.wallet.domain.port.IWalletTransactionPort;
import world.inclub.wallet.infraestructure.kafka.dtos.response.UserAccountDTO;
import world.inclub.wallet.infraestructure.kafka.service.KafkaRequestReplyAccountService;
import world.inclub.wallet.infraestructure.serviceagent.service.NotificationService;
import world.inclub.wallet.infraestructure.serviceagent.service.interfaces.IAdminPanelService;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class WalletTransactionServiceImpl implements IWalletTransactionService {

    private final IWalletTransactionPort iWalletTransactionPort;
    private final IWalletService iWalletService;
    private final ITypeWalletTransactionService iTypeWalletTransactionService;
    private final ITokenWalletTransactionService iTokenWalletTransactionService;
    private final KafkaRequestReplyAccountService serviceKafka;

    private final IAdminPanelService adminPanelService;
    private final NotificationService notificationService;
    private final CircuitBreakerRegistry circuitBreakerRegistry;

    private final ITransactionPaypalPort iTransactionPaypalPort;

    @Override
    public Flux<WalletTransactionResponseDTO> getWalletSuccessfulTransactions(int idWallet,String search) {
        return iWalletTransactionPort.getWalletSuccessfulTransactionsResponse(idWallet, search);
    }
    @Override
    public Flux<WalletTransactionResponseDTO> getWalletTransferTransactions(int idWallet,  List<Integer> transferTypeIds,String search) {
        return iWalletTransactionPort.getWalletTransferTransactionsResponse(idWallet, transferTypeIds,search);
    }
    @Override
    public Flux<WalletTransactionResponseDTO> getWalletRechargeTransactions(int idWallet,  Integer transferTypeIds,String search) {
        return iWalletTransactionPort.getWalletRechargeTransactionsResponse(idWallet, transferTypeIds,search);
    }
    @Override
    public Flux<TypeWalletTransactionResponseDTO> listTypeWalletTransaction() {
        return iTypeWalletTransactionService.listTypeWalletTransaction()
                .map(this::mapTypeTransactionToTypeWalletTransactionResponseDTO);
    }

    private TypeWalletTransactionResponseDTO mapTypeTransactionToTypeWalletTransactionResponseDTO(TypeWalletTransaction typeWalletTransaction) {

        TypeWalletTransactionResponseDTO transaction = new TypeWalletTransactionResponseDTO();
        transaction.setIdTypeWalletTransaction(typeWalletTransaction.getIdTypeWalletTransaction());
        transaction.setDescription(typeWalletTransaction.getDescription());

        return transaction;
    }

    @Override
    public Mono<Tuple2<Flux<WalletTransactionResponseDTO>, Integer>> getWalletSuccessfulTransactionsWhitPagina(Integer idWallet, int page, int size,String search) {

        Pageable pageable = PageRequest.of(page, size);
        return getWalletSuccessfulTransactions(idWallet,search)
                .collectList()
                .map(list -> {
                    int totalItems = list.size();
                    List<WalletTransactionResponseDTO> paginatedList = list.stream()
                            .skip((long) pageable.getPageNumber() * pageable.getPageSize()) // Salta elementos según la página
                            .limit(pageable.getPageSize()) // Limita al tamaño de página
                            .toList();

                    return Tuples.of(Flux.fromIterable(paginatedList), totalItems);
                });
    }

    @Override
    public Mono<Tuple2<Flux<WalletTransactionResponseDTO>, Integer>> getWalletRechargeTransactionsWithPagination(Integer idWallet, int page, int size, Integer transferTypeIds,String search) {
        Pageable pageable = PageRequest.of(page, size);
        return getWalletRechargeTransactions(idWallet, transferTypeIds,search)
                .collectList()
                .map(list -> {
                    int totalItems = list.size();
                    List<WalletTransactionResponseDTO> paginatedList = list.stream()
                            .skip((long) pageable.getPageNumber() * pageable.getPageSize())
                            .limit(pageable.getPageSize())
                            .toList();
                    return Tuples.of(Flux.fromIterable(paginatedList), totalItems);
                });
    }

    @Override
    public Mono<Tuple2<Flux<WalletTransactionResponseDTO>, Integer>> getWalletTransferTransactionsWithPagination(Integer idWallet, int page, int size, List<Integer> transferTypeIds,String search) {
        Pageable pageable = PageRequest.of(page, size);
        return getWalletTransferTransactions(idWallet, transferTypeIds,search)
                .collectList()
                .map(list -> {
                    int totalItems = list.size();
                    List<WalletTransactionResponseDTO> paginatedList = list.stream()
                            .skip((long) pageable.getPageNumber() * pageable.getPageSize())
                            .limit(pageable.getPageSize())
                            .toList();
                    return Tuples.of(Flux.fromIterable(paginatedList), totalItems);
                });
    }
    @Override
    public Mono<Boolean> validateWalletCode(Integer walletCode) {

        Long idWalletTransactional = Long.valueOf(walletCode);

        return iWalletTransactionPort.getWalletTransactionById(idWalletTransactional)
                .flatMap(result -> {
                    if (result != null) {
                        return Mono.just(true);
                    }else {
                        return Mono.just(false);
                    }
                })
                .switchIfEmpty( Mono.just(false) );
    }


    @Override
    public Mono<Boolean> registerTransferBetweenPartners(int idUserEnvia, int idUserReceivingTransfer,
                                                         WalletTransaction walletTransaction, TokenRequestDTO tokenRequest) {

        CircuitBreaker circuitBreaker = circuitBreakerRegistry.circuitBreaker("registerTransferBetweenPartners");
        final boolean ISOPERATIONADMIN = false;

        return iTokenWalletTransactionService.verifyValidityToken(tokenRequest.getIdUser(), tokenRequest.getCodeToken()).flatMap(t -> {
                    if (t) {
                        return Mono.zip(serviceKafka.getUserAccountById(idUserReceivingTransfer),
                                        serviceKafka.getUserAccountById(idUserEnvia))

                                .flatMap(tuple2 -> {

                                    UserAccountDTO userRecibe = tuple2.getT1();
                                    UserAccountDTO userEnvia = tuple2.getT2();

                                    boolean isTransferPayLater;
                                    if (userRecibe.getIdState().intValue() == State.PagarDespues.getValue()) {
                                        isTransferPayLater = FlagEnabled.Active.getValue();
                                    } else {
                                        isTransferPayLater = FlagEnabled.Inactive.getValue();
                                    }

                                    boolean finalIsTransferPayLater = isTransferPayLater;

                                    return registerTransferBetweenWallets(userEnvia, userRecibe,
                                            walletTransaction.getAmount(),
                                            ISOPERATIONADMIN, finalIsTransferPayLater, walletTransaction.getInitialDate())
                                            .thenReturn(true);

                                }).switchIfEmpty(Mono.error(new RuntimeException("No se encontró el usuario")));
                    } else {
                        return Mono.just(false);
                    }
                }).transformDeferred(CircuitBreakerOperator.of(circuitBreaker))
                .doOnError(CallNotPermittedException.class, e -> {
                    log.error("Circuit Breaker is open. Fallback logic here.");
                    throw new RuntimeException("API service is unavailable");

                });


    }

    @Override
    public Mono<Boolean> registerTransferBetweenWallets(UserAccountDTO userEnvia, UserAccountDTO userReceivingTransfer, BigDecimal amount,
                                                        boolean isTransactionAdmin, boolean isTransferPayLater, LocalDateTime initialDate) {

        int idUserEnvia= userEnvia.getIdUser().intValue() ;
        int idUserReceivingTransfer= userReceivingTransfer.getIdUser().intValue() ;

        //Para el Correo
        UserResponse userResponse = UserMapper.toUserResponse(userEnvia);
        SponsorResponse userReceivingResponse = UserMapper.toSponsorResponse(userReceivingTransfer);


        int idEnvioTransfer = CodeTypeWalletTransaction.ENVIO_TRANSFERENCIA.getValue();
        int idRecepcionTransfer = CodeTypeWalletTransaction.RECEPCION_TRANSFERENCIA.getValue();

        String referenceDataEnvio;
        String referenceDataReceptor;
        // boolean isUserAllowedTransfer;

        if (isTransactionAdmin) {
            referenceDataEnvio = String.format("Transferencia a wallet de usuario : %s",
                    userReceivingTransfer.getUsername());
            referenceDataReceptor = String.format("Recepción de transferencia wallet de usuario : %s",
                    userEnvia.getUsername());
            // isUserAllowedTransfer = true;
        } else {
            if (isTransferPayLater == FlagEnabled.Active.getValue()) {
                idEnvioTransfer = CodeTypeWalletTransaction.ENVIO_TRANSFERENCIA_PAGO_DESPUES.getValue();
                idRecepcionTransfer = CodeTypeWalletTransaction.RECEPCION_TRANSFERENCIA_PAGO_DESPUES
                        .getValue();
            }
            referenceDataEnvio = userReceivingTransfer.getUsername();
            referenceDataReceptor = userEnvia.getUsername();
            // isUserAllowedTransfer = true;
        }

        WalletTransaction walletTransactionEnvio = new WalletTransaction(idEnvioTransfer, initialDate,
                amount,
                referenceDataEnvio);
        WalletTransaction walletTransactionRecepcion = new WalletTransaction(idRecepcionTransfer,
                initialDate, amount,
                referenceDataReceptor);

        return registerTransaction(walletTransactionEnvio, idUserEnvia).flatMap(register1 -> {
            if (register1 != null) {
                return registerTransaction(walletTransactionRecepcion, idUserReceivingTransfer)
                        .flatMap(register2 -> {
                            if (register2 != null) {

                                if (isTransferPayLater) {
                                    Integer idTransaction = register1.getIdWalletTransaction().intValue();
                                    return notificationService.sendEmailTransferForPaymentAfterMembership(userResponse, userReceivingResponse, idTransaction);
                                } else {
                                    return Mono.just(true);
                                }
                            } else {
                                System.out.println("Caso5");
                                return Mono.just(false);
                            }
                        });
            } else {
                // Manejo de ERROR
                System.out.println("Caso4");
                return Mono.just(false);
            }
        });

    }

    @Override
    public Mono<Boolean> checkUserAllowedTransfer(boolean isUserAllowedTransfer) {

        if (isUserAllowedTransfer) {
            return Mono.just(true);
        } else {
            // Control de errores con el grobal
            return Mono.just(false);
        }
    }

    @Override
    public Mono<WalletTransaction> registerAdminPanelTransaction(AdminPanelTransactionRequest request) {

        return Mono.zip(
                serviceKafka.getUserAccountById(request.getIdUser()),
                iWalletService.getWalletByIdUser(request.getIdUser()),
                iTypeWalletTransactionService.getTypeWalletTransaction(request.getOperationType())
        ).flatMap(tuple ->{

            UserAccountDTO userAccountDTO = tuple.getT1();
            Wallet wallet = tuple.getT2();
            TypeWalletTransaction typeWalletTransaction = tuple.getT3();

            Long idWallet = wallet.getIdWallet();

            String referenceData = typeWalletTransaction.getDescription() +": "+ request.getNote();

            WalletTransaction walletTransaction = new WalletTransaction();
            walletTransaction.setIdWallet(idWallet);
            walletTransaction.setAmount(request.getAmount());
            walletTransaction.setIdTypeWalletTransaction(request.getOperationType());
            walletTransaction.setReferenceData(referenceData);

            return registerTransaction(walletTransaction, request.getIdUser());
        });
    }

    @Override
    public Mono<WalletTransactionRechargeDTO> walletChargerPaypal(AdminPanelTransactionRequest request, String code) {

        return Mono.zip(
                iWalletService.getWalletByIdUser(request.getIdUser()),
                iTypeWalletTransactionService.getTypeWalletTransaction(request.getOperationType())
        ).flatMap(tuple ->{

            Wallet wallet = tuple.getT1();
            TypeWalletTransaction typeWalletTransaction = tuple.getT2();

            Long idWallet = wallet.getIdWallet();
            String referenceData = typeWalletTransaction.getDescription() +": "+ request.getNote();
            WalletTransaction walletTransaction = new WalletTransaction();
            walletTransaction.setIdWallet(idWallet);
            walletTransaction.setAmount(request.getAmount());
            walletTransaction.setIdTypeWalletTransaction(request.getOperationType());
            walletTransaction.setReferenceData(referenceData);

            return registerTransaction(walletTransaction, request.getIdUser())
                    .flatMap(savedTransaction -> {
                        WalletTransactionRechargeDTO dto = new WalletTransactionRechargeDTO();
                        dto.setIdWalletTransaction(savedTransaction.getIdWalletTransaction());
                        dto.setIdWallet(savedTransaction.getIdWallet());
                        dto.setAmount(savedTransaction.getAmount());
                        dto.setIsAvailable(savedTransaction.getIsAvailable());
                        dto.setReferenceData(savedTransaction.getReferenceData());
                        dto.setIsSucessfulTransaction(savedTransaction.getIsSucessfulTransaction());

                        TransactionPaypal transactionPaypal = new TransactionPaypal(savedTransaction.getIdWalletTransaction(),code);

                       return iTransactionPaypalPort.createTransactionPaypal(transactionPaypal)
                            .map(rs -> {
                                dto.setTransactionPaypal(rs + " exito");
                                return dto;
                            })
                            .onErrorResume(e -> {
                                dto.setTransactionPaypal("Error: " + e.getMessage());
                                return Mono.just(dto);
                            });
                    });
        });
    }


    @Transactional
    @Override
    public Mono<WalletTransaction> registerTransaction(WalletTransaction transaction, int idUser) {
        return iWalletService.getWalletByIdUser(idUser).flatMap(wallet -> {
            return iTypeWalletTransactionService
                    .getTypeWalletTransaction(transaction.getIdTypeWalletTransaction())
                    .flatMap(typeWalletTransaction -> {

                        int idCurrency = Currency.Dolar.getValue();
                        BigDecimal amountRealOperation = iTypeWalletTransactionService
                                .GetValueRealTypeTransaction(transaction.getAmount(),
                                        typeWalletTransaction.getIdTransactionCategory());

                        return checkValidityTransactionRegardingAmount(wallet.getIdUser().intValue(),
                                typeWalletTransaction.getIdTransactionCategory(), amountRealOperation)
                                .flatMap(isValid -> {
                                    if (isValid) {
                                        return adminPanelService.getTypeExchange()
                                                .flatMap(exchageRate -> {
                                                    Wallet walletUser = wallet;
                                                    transaction.setAmount(amountRealOperation);
                                                    // realizamos la transaccion de acuerdo al tipo de saldo que se modificara en el
                                                    // wallet
                                                    if (typeWalletTransaction.getIsTransferBalanceAvailable() ==
                                                            TypeBalanceTransfer.Available.getValue()) {
                                                        return registerTransactionAvailableBalance(transaction,
                                                                walletUser.getIdWallet(), exchageRate,
                                                                typeWalletTransaction.getIdTypeWalletTransaction(),
                                                                idCurrency)
                                                                .flatMap(savedTransaction ->
                                                                        // actualizamos wallet
                                                                        // se actualiza ambos saldos
                                                                        iWalletService.changeBalancesWallet(wallet,
                                                                                        amountRealOperation, amountRealOperation)
                                                                                .thenReturn(savedTransaction));
                                                    } else {
                                                        return registerTransactionAccountingBalance(transaction,
                                                                walletUser.getIdWallet(), exchageRate,
                                                                typeWalletTransaction.getIdTypeWalletTransaction(),
                                                                idCurrency)
                                                                .flatMap(savedTransaction -> {
                                                                    if (savedTransaction != null) {
                                                                        if (transaction.getIdTypeWalletTransaction() ==
                                                                                CodeTypeWalletTransaction.RETIRO.getValue()) {
                                                                            return iWalletService.changeAccountingBalanceWallet(
                                                                                            wallet, amountRealOperation,
                                                                                            typeWalletTransaction.getIdTypeWalletTransaction())
                                                                                    .thenReturn(savedTransaction);
                                                                        } else {
                                                                            return iWalletService.changeAccountingBalanceWalletBrandExclusive(
                                                                                            wallet, amountRealOperation,
                                                                                            typeWalletTransaction.getIdTypeWalletTransaction())
                                                                                    .thenReturn(savedTransaction);
                                                                        }
                                                                    } else {
                                                                        return Mono.error(new RuntimeException("Error en transacción de saldo contable"));
                                                                    }
                                                                });
                                                    }
                                                });
                                    } else {
                                        return Mono.error(new RuntimeException(
                                                "El monto de tu transacción es mayor a tu saldo disponible"));
                                    }
                                });
                    });
        }).switchIfEmpty(Mono.error(new RuntimeException("No se encontró la wallet del usuario")));
    }
    @Transactional
    @Override
    public Mono<Boolean> solictudBanTransaction(WalletTransaction transaction, int idUser) {
        return iWalletService.getWalletByIdUser(idUser).flatMap(wallet -> {
            return iTypeWalletTransactionService
                    .getTypeWalletTransaction(transaction.getIdTypeWalletTransaction())
                    .flatMap(typeWalletTransaction -> {

                        int idCurrency = Currency.Dolar.getValue();
                        BigDecimal amountRealOperation = iTypeWalletTransactionService
                                .GetValueRealTypeTransaction(transaction.getAmount(),
                                        typeWalletTransaction.getIdTransactionCategory());

                        return checkValidityTransactionRegardingAmount(wallet.getIdUser().intValue(),
                                typeWalletTransaction.getIdTransactionCategory(), amountRealOperation)
                                .flatMap(isValid -> {
                                    if (isValid) {
                                                    Wallet walletUser = wallet;
                                                    transaction.setAmount(amountRealOperation);
                                                    // realizamos la transaccion de acuerdo al tipo de saldo que se modificara en el
                                                    // wallet
                                                    return iWalletService.solicitudeAvailableBalance(wallet,
                                                                    amountRealOperation, amountRealOperation)
                                                            .then(Mono.just(true))
                                                            .onErrorReturn(false);
                                    } else {
                                        return Mono.error(new RuntimeException(
                                                "El monto de tu transacción es mayor a tu saldo disponible"));
                                    }
                                });
                    });
        });
                //.switchIfEmpty(Mono.error(new RuntimeException("No se encontró la wallet del usuario")));
    }
    @Transactional
    @Override
    public Mono<Boolean> rechasoBanTransaction(WalletTransaction transaction, int idUser) {
        return iWalletService.getWalletByIdUser(idUser).flatMap(wallet -> {
            return iTypeWalletTransactionService
                    .getTypeWalletTransaction(transaction.getIdTypeWalletTransaction())
                    .flatMap(typeWalletTransaction -> {

                        int idCurrency = Currency.Dolar.getValue();
                        BigDecimal amountRealOperation = iTypeWalletTransactionService
                                .GetValueRealTypeTransaction(transaction.getAmount(),
                                        typeWalletTransaction.getIdTransactionCategory());

                        return checkValidityTransactionRegardingAmount(wallet.getIdUser().intValue(),
                                typeWalletTransaction.getIdTransactionCategory(), amountRealOperation)
                                .flatMap(isValid -> {
                                    if (isValid) {
                                        Wallet walletUser = wallet;
                                        transaction.setAmount(amountRealOperation);
                                        // realizamos la transaccion de acuerdo al tipo de saldo que se modificara en el
                                        // wallet
                                        return iWalletService.solicitudeAvailableBalance(wallet,
                                                        amountRealOperation, amountRealOperation)
                                                .then(Mono.just(true))
                                                .onErrorReturn(false);
                                    } else {
                                        return Mono.error(new RuntimeException(
                                                "El monto de tu transacción es mayor a tu saldo disponible"));
                                    }
                                });
                    });
        });
        //.switchIfEmpty(Mono.error(new RuntimeException("No se encontró la wallet del usuario")));
    }

    @Transactional
    @Override
    public Mono<WalletTransaction> aprobacionBanTransaction(WalletTransaction transaction, int idUser) {
        return iWalletService.getWalletByIdUser(idUser).flatMap(wallet -> {
            return iTypeWalletTransactionService
                    .getTypeWalletTransaction(transaction.getIdTypeWalletTransaction())
                    .flatMap(typeWalletTransaction -> {

                        int idCurrency = Currency.Dolar.getValue();
                        BigDecimal amountRealOperation = iTypeWalletTransactionService
                                .GetValueRealTypeTransaction(transaction.getAmount(),
                                        typeWalletTransaction.getIdTransactionCategory());

                        return checkValidityTransactionRegardingAmount(wallet.getIdUser().intValue(),
                                typeWalletTransaction.getIdTransactionCategory(), amountRealOperation)
                                .flatMap(isValid -> {
                                    if (isValid) {
                                        return adminPanelService.getTypeExchange()
                                                .flatMap(exchageRate -> {
                                                    Wallet walletUser = wallet;
                                                    transaction.setAmount(amountRealOperation);
                                                    // realizamos la transaccion de acuerdo al tipo de saldo que se modificara en el
                                                    // wallet
                                                    if (typeWalletTransaction.getIsTransferBalanceAvailable() ==
                                                            TypeBalanceTransfer.Available.getValue()) {
                                                        return registerTransactionAvailableBalance(transaction,
                                                                walletUser.getIdWallet(), exchageRate,
                                                                typeWalletTransaction.getIdTypeWalletTransaction(),
                                                                idCurrency)
                                                                .flatMap(savedTransaction ->
                                                                        // actualizamos wallet
                                                                        // se actualiza ambos saldos
                                                                        iWalletService.aprobacionaccountingBalance(wallet,
                                                                                        amountRealOperation, amountRealOperation)
                                                                                .thenReturn(savedTransaction));
                                                    } else {
                                                        return registerTransactionAccountingBalance(transaction,
                                                                walletUser.getIdWallet(), exchageRate,
                                                                typeWalletTransaction.getIdTypeWalletTransaction(),
                                                                idCurrency)
                                                                .flatMap(savedTransaction -> {
                                                                    if (savedTransaction != null) {
                                                                        if (transaction.getIdTypeWalletTransaction() ==
                                                                                CodeTypeWalletTransaction.RETIRO.getValue()) {
                                                                            return iWalletService.changeAccountingBalanceWallet(
                                                                                            wallet, amountRealOperation,
                                                                                            typeWalletTransaction.getIdTypeWalletTransaction())
                                                                                    .thenReturn(savedTransaction);
                                                                        } else {
                                                                            return iWalletService.changeAccountingBalanceWalletBrandExclusive(
                                                                                            wallet, amountRealOperation,
                                                                                            typeWalletTransaction.getIdTypeWalletTransaction())
                                                                                    .thenReturn(savedTransaction);
                                                                        }
                                                                    } else {
                                                                        return Mono.error(new RuntimeException("Error en transacción de saldo contable"));
                                                                    }
                                                                });
                                                    }
                                                });
                                    } else {
                                        return Mono.error(new RuntimeException(
                                                "El monto de tu transacción es mayor a tu saldo disponible"));
                                    }
                                });
                    });
        }).switchIfEmpty(Mono.error(new RuntimeException("No se encontró la wallet del usuario")));
    }

    @Override
    public Mono<Boolean> checkValidityTransactionRegardingAmount(int idUser, int idTransactionCategory,
                                                                 BigDecimal amountTransaction) {

        BigDecimal absoluteValue;
        TransactionCategory type = TransactionCategory.fromValue(idTransactionCategory);

        return switch (type) {
            case Ingreso ->
                // si es ingreso siempre sera valida la transaccion
                    Mono.just(true);
            case Egreso -> {
                absoluteValue = amountTransaction.abs();
                yield iWalletService.checkTransactionValidity(idUser, absoluteValue);
            }
            case Deuda ->
                // si es una deuda (inclub empresta dinero) se puede aregar reglas pero por el
                // momento siempre va ser valida
                    Mono.just(true);
            case PagoDeuda -> {
                // si se paga deuda es un egreso y se valida
                absoluteValue = amountTransaction.abs();
                yield iWalletService.checkTransactionValidity(idUser, absoluteValue);
            }
            default ->
                // Manejo de error "No existe esa categoría o falta desarrollarla"
                    Mono.just(false);
        };

    }

    @Override
    public Mono<WalletTransaction> registerTransactionAvailableBalance(WalletTransaction transaction, Long idWallet,
                                                                       ExchangeRateDTO exchagenRate, int idTypeWalletTransaction, int idCurrency) {

        Boolean isAvailable = true; // siempre será verdadero ya que solo son validas operaciones de saldo
        // disponible

        WalletTransaction walletTrans = new WalletTransaction(idWallet, idTypeWalletTransaction, idCurrency,
                exchagenRate.getIdExchangeRate(), transaction.getAmount(), isAvailable, transaction.getReferenceData());
        return iWalletTransactionPort.saveWalletTransaction(walletTrans)
                .switchIfEmpty(Mono.error(new RuntimeException("Error al guardar la transacción de saldo disponible")));
    }

    @Override
    public Mono<WalletTransaction> registerTransactionAccountingBalance(WalletTransaction transaction, Long idWallet,
                                                                        ExchangeRateDTO exchagenRate, int idTypeWalletTransaction, int idCurrency) {

        int DAYSDISPON = 4;
        Boolean isAvailable = true; // siempre será falso ya que solo son validas operaciones contables
        LocalDateTime createDate = LocalDateTime.now();

        //LocalDateTime availableDate = createDate.plusDays(DAYSDISPON);

        //if (idTypeWalletTransaction == CodeTypeWalletTransaction.RETIRO.getValue()) {
          //  availableDate = availableDate.plusDays(15); // si es retiro se agrega 15 días de respuesta.
        //}
// availableDate,
        WalletTransaction walletTrans = new WalletTransaction(idWallet, idTypeWalletTransaction, idCurrency,
                exchagenRate.getIdExchangeRate(), transaction.getAmount(), isAvailable,
                transaction.getReferenceData());

        return iWalletTransactionPort.saveWalletTransaction(walletTrans)
                .switchIfEmpty(Mono.error(new RuntimeException("Error al guardar la transacción de saldo disponible")));
    }

    @Override
    public Mono<WalletTransaction> processPaymentWithWallet(Long idUserPayment, WalletTransaction transaction,
                                                            int typeWalletTransaction, Boolean isFullPayment, String detailPayment) {

        int idUser = idUserPayment.intValue();

        CodeTypeWalletTransaction type = CodeTypeWalletTransaction.fromValue(typeWalletTransaction);

        // Selecciona el diccionario basado en el valor de isFullPayment
        Map<CodeTypeWalletTransaction, String> dictionaryReference = isFullPayment
                ? DictionaryData.DicCodWalletTransactionFullPay
                : DictionaryData.DicCodWalletTransactionPartialPay;

        switch (type) {
            case PAGO_CUOTA:
            case COMPRA_SUSCRIPCION_EXTRA:
            case REGISTRO_SOCIO:
            case COMPRA_ENTRADAS_EVENTOS:
            case UPGRADE_SUSCRIPCION:
                transaction.setIdTypeWalletTransaction(type.getValue());
                if (transaction.getReferenceData() == null || transaction.getReferenceData().isEmpty()) {
                    transaction.setReferenceData(dictionaryReference.get(type) + " : " + detailPayment);
                }
                break;
            default:
                return Mono.error(new RuntimeException(
                        "No es permitido otro código de operación para pago completo de cuota con wallet"));
        }
        return registerTransaction(transaction, idUser);
    }

    @Override
    public Mono<Boolean> rollbackTransactionAndRefund(Integer idTransaction) {

        Long idWalletTransaction = Long.valueOf(idTransaction);

        return iWalletTransactionPort.getWalletTransactionById(idWalletTransaction)
                .flatMap(walletTransaction -> {

                    BigDecimal amount = walletTransaction.getAmount();
                    BigDecimal adjustedAmount = amount.signum() > 0 ? amount.negate() : amount.abs();
                    Integer typeOperation = CodeTypeWalletTransaction.DEVOLUCION_SALDO.getValue();
                    LocalDateTime edit = walletTransaction.getAvailabilityDate().plusMinutes(1);
                    String referenceData = "Error en el proceso de pago";

                    walletTransaction.setAmount(adjustedAmount);
                    walletTransaction.setIdTypeWalletTransaction(typeOperation);
                    walletTransaction.setReferenceData(referenceData);
                    walletTransaction.setAvailabilityDate(edit);
                    walletTransaction.setIdWalletTransaction(null);

                    return iWalletService.getWalletById(walletTransaction.getIdWallet())
                            .flatMap(wallet -> {

                                return iWalletTransactionPort.saveWalletTransaction(walletTransaction)
                                        .flatMap(savedTransaction -> {
                                            if (savedTransaction != null) {
                                                return iWalletService.changeBalancesWallet(wallet,
                                                        adjustedAmount,adjustedAmount)
                                                        .thenReturn(true);
                                            } else {
                                                return Mono.just(false);
                                            }
                                        });
                            });
                });
    }

    @Override
    @Transactional
    public Mono<Boolean> registerTransferBetweenWallets(WalletTransactionRequest request) {
        return Mono.zip(
                serviceKafka.getUserAccountById(request.senderUserId()),
                serviceKafka.getUserAccountById(request.receiverUserId())
        ).flatMap(tuple -> {
            UserAccountDTO senderUser = tuple.getT1();
            UserAccountDTO receiverUser = tuple.getT2();

            LocalDateTime now = LocalDateTime.now();

            String refSender = (request.referenceDataSender() != null && !request.referenceDataSender().isBlank())
                    ? request.referenceDataSender()
                    : "Transferencia enviada a: " + receiverUser.getUsername();
            String refReceiver = (request.referenceDataReceiver() != null && !request.referenceDataReceiver().isBlank())
                    ? request.referenceDataReceiver() + " " + senderUser.getUsername()
                    : "Transferencia recibida de: " + senderUser.getUsername();

            WalletTransaction sendTransaction = new WalletTransaction(
                    request.sendCodeId(), now, request.amount(), refSender
            );
            WalletTransaction receiveTransaction = new WalletTransaction(
                    request.receiveCodeId(), now, request.amount(), refReceiver
            );

            return Mono.zip(
                            registerTransaction(sendTransaction, senderUser.getIdUser().intValue()),
                            registerTransaction(receiveTransaction, receiverUser.getIdUser().intValue())
                    )
                    .thenReturn(true)
                    .onErrorResume(error -> {
                        log.error("Error during transfer: {}", error.getMessage(), error);
                        return Mono.just(false);
                    });
        });
    }

}
