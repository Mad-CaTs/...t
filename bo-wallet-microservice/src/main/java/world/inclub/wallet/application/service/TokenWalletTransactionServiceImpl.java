package world.inclub.wallet.application.service;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.api.dtos.response.SponsorResponse;
import world.inclub.wallet.api.dtos.response.UserResponse;
import world.inclub.wallet.api.mapper.UserMapper;
import world.inclub.wallet.application.service.interfaces.ITokenGeneratorService;
import world.inclub.wallet.application.service.interfaces.ITokenWalletTransactionService;
import world.inclub.wallet.domain.entity.TokenGestionBancario;
import world.inclub.wallet.domain.entity.TokenWalletTransaction;
import world.inclub.wallet.domain.port.ITokenGestionBancarioPort;
import world.inclub.wallet.domain.port.ITokenWalletTransactionPort;
import world.inclub.wallet.domain.port.IWalletPort;
import world.inclub.wallet.infraestructure.config.TokenEncoderConfig.TokenEncoder;
import world.inclub.wallet.infraestructure.kafka.service.KafkaRequestReplyAccountService;
import world.inclub.wallet.infraestructure.serviceagent.service.AccountService;
import world.inclub.wallet.infraestructure.serviceagent.service.NotificationService;

@Slf4j
@Service
@RequiredArgsConstructor
public class TokenWalletTransactionServiceImpl implements ITokenWalletTransactionService {

    private final ITokenWalletTransactionPort iTokenWalletTransactionPort;
    private final ITokenGestionBancarioPort iTokenGestionBancarioPort;
    private final IWalletPort iWalletPort;
    private final ITokenGeneratorService tokenGenerator;
    private final TokenEncoder tokenEncoder;
    private final KafkaRequestReplyAccountService serviceKafka;
    private final NotificationService notificationService;
    private final AccountService accountService;

    @Override
    public Flux<TokenWalletTransaction> getAlls() {
        return iTokenWalletTransactionPort.getAlls();
    }

    @Override
    public Mono<Boolean> generateToken(int idUser, int idUserReceivingTransfer) {

        if (idUser == idUserReceivingTransfer) {
            // Retorna false si los IDs son iguales
            return Mono.error(new RuntimeException(
                        "No esta permitido realizar transacciones a su misma cuenta"));
        }

        // Verificamos la Wallet del Propietario por 2da vez en el proceso
        return iWalletPort.getWalletByIdUser(idUser)

                .flatMap(wallet -> {
                    if (wallet != null) {

                        // Verificamos si existe el destinatario ("Esto debería Preguntar a Account)
                        return iWalletPort.getWalletByIdUser(idUserReceivingTransfer).hasElement()
                                .flatMap(exis -> {
                                    if (exis) {
                                        String token = tokenGenerator.generateToken();
                                        log.info(token);

                                        TokenWalletTransaction tokenWalletTransaction = new TokenWalletTransaction(
                                                wallet.getIdWallet(), tokenEncoder.encode(token));

                                            Mono<UserResponse> userMono = serviceKafka.getUserAccountById(idUser)
                                                .map(UserMapper::toUserResponse);
                                        Mono<SponsorResponse> userReceivingTranMono = serviceKafka
                                                .getUserAccountById(idUserReceivingTransfer)
                                                .map(UserMapper::toSponsorResponse);

                                        return Mono.zip(userMono, userReceivingTranMono).flatMap(tuple -> {
                                            UserResponse user = tuple.getT1();
                                            SponsorResponse userReceivingTran = tuple.getT2();

                                            return notificationService
                                                    .sendEmailTokenTransferWallet(user, userReceivingTran, token)
                                                    .then(iTokenWalletTransactionPort
                                                            .saveToken(tokenWalletTransaction));

                                        });

                                    } else {
                                        // Debería dar un Error X Corregir
                                        return Mono.just(false);
                                    }
                                });
                        // Lógica adicional si la wallet existe

                    } else {
                        // Retorna false si no existe la wallet
                        // Debería dar un Error X Corregir
                        return Mono.just(false);
                    }
                });
    }
    @Override
    public Mono<Boolean>generateTokenGestionBancaria(int idUser) {
        // Verificamos la Wallet del Propietario por 2da vez en el proceso
        return iWalletPort.getWalletByIdUser(idUser)
                .flatMap(wallet -> {
                    if (wallet == null) {
                        return Mono.just(false);
                    }

                    String token = tokenGenerator.generateToken();
                    log.info(token);

                    TokenGestionBancario tokenGestionBancario = new TokenGestionBancario(
                            wallet.getIdUser(), tokenEncoder.encode(token));

                    Mono<UserResponse> userMono = serviceKafka.getUserAccountById(idUser)
                            .map(UserMapper::toUserResponse);
                    Mono<SponsorResponse> userReceivingTranMono = serviceKafka
                            .getUserAccountById(idUser)
                            .map(UserMapper::toSponsorResponse);
                    return Mono.zip(userMono, userReceivingTranMono).flatMap(tuple -> {
                        UserResponse user = tuple.getT1();
                        SponsorResponse userReceivingTran = tuple.getT2();

                        return notificationService
                                .sendEmailTokenGestionBancario(user, userReceivingTran, token)
                                .then(iTokenGestionBancarioPort
                                        .saveToken(tokenGestionBancario).onErrorReturn(false));

                    });
                }).switchIfEmpty(Mono.just(false))
                .onErrorReturn(false);
    }
    @Override
    public Mono<Boolean> verifyValidityToken(int idUser, String codeToken) {

        return iWalletPort.getWalletByIdUser(idUser).flatMap(wallet -> {
            String codeTokenEncrip = tokenEncoder.encode(codeToken);
            log.info(codeTokenEncrip);
            return iTokenWalletTransactionPort.getTokenWalletTransactionByCode(wallet.getIdWallet(), codeTokenEncrip)
                    .flatMap(this::isTokenValid);
        });
    }
    @Override
    public Mono<Boolean> verifyValidityTokenGestionBancaria(int idUser, String codeToken) {

        return iWalletPort.getWalletByIdUser(idUser).flatMap(wallet -> {
            String codeTokenEncrip = tokenEncoder.encode(codeToken);
            log.info(codeTokenEncrip);
            return iTokenGestionBancarioPort.getTokenGestionBancarioByCode(wallet.getIdUser(), codeTokenEncrip)
                    .flatMap(this::isTokenValidGestionBancaria);
        });
    }
    @Override
    public Mono<Boolean> isTokenValid(TokenWalletTransaction token) {

        if (token != null) {
            LocalDateTime dateValidation = LocalDateTime.now();
            if (token.getExpirationDate().isAfter(dateValidation) && (token.getIsTokenValid().equals(true))) {

                token.setIsTokenValid(false);

                return Mono.just(true)
                        .then(iTokenWalletTransactionPort.saveToken(token));
            } else {
                // Manejo con el error global
                return Mono.just(false);
            }
        } else {
            // Esto debe ser un error del global
            return Mono.just(false);
        }

    }

    @Override
    public Mono<Boolean> isTokenValidGestionBancaria(TokenGestionBancario token) {

        if (token != null) {
            LocalDateTime dateValidation = LocalDateTime.now();
            if (token.getExpirationDate().isAfter(dateValidation) && (token.getIsTokenValid().equals(true))) {

                token.setIsTokenValid(false);

                return Mono.just(true)
                        .then(iTokenGestionBancarioPort.saveToken(token));
            } else {
                // Manejo con el error global
                return Mono.just(false);
            }
        } else {
            // Esto debe ser un error del global
            return Mono.just(false);
        }

    }
}
