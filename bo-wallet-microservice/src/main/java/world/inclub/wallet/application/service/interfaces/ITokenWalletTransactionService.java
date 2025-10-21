package world.inclub.wallet.application.service.interfaces;


import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.domain.entity.TokenGestionBancario;
import world.inclub.wallet.domain.entity.TokenWalletTransaction;


public interface ITokenWalletTransactionService {

     public Flux<TokenWalletTransaction> getAlls();
     public Mono<Boolean> generateToken(int idUser, int idUserReceivingTransfer);
     public Mono<Boolean> generateTokenGestionBancaria(int idUser);

     public Mono<Boolean> verifyValidityToken(int idUser, String codeToken);
     public Mono<Boolean> verifyValidityTokenGestionBancaria(int idUser, String codeToken);
     public Mono<Boolean> isTokenValid(TokenWalletTransaction token);
     public Mono<Boolean> isTokenValidGestionBancaria(TokenGestionBancario token);
}
