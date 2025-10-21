package world.inclub.wallet.domain.port;

import reactor.core.publisher.Mono;
import world.inclub.wallet.domain.entity.TokenGestionBancario;
import world.inclub.wallet.domain.entity.TokenWalletTransaction;

public interface ITokenGestionBancarioPort {
    public Mono<Boolean> saveToken(TokenGestionBancario token);
    public Mono<TokenGestionBancario> getTokenGestionBancarioByCode(Long idUser, String codeToken);

}
