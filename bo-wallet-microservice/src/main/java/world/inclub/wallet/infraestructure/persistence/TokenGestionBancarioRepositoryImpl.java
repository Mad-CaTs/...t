package world.inclub.wallet.infraestructure.persistence;

import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;
import world.inclub.wallet.domain.entity.TokenGestionBancario;
import world.inclub.wallet.domain.entity.TokenWalletTransaction;
import world.inclub.wallet.domain.port.ITokenGestionBancarioPort;
import world.inclub.wallet.infraestructure.repository.ITokenGestionBancarioRepository;

@Repository
public class TokenGestionBancarioRepositoryImpl implements ITokenGestionBancarioPort {
 private final ITokenGestionBancarioRepository iTokenGestionBancarioRepository;

    public TokenGestionBancarioRepositoryImpl(ITokenGestionBancarioRepository iTokenGestionBancarioRepository) {
        this.iTokenGestionBancarioRepository = iTokenGestionBancarioRepository;
    }

    @Override
    public Mono<Boolean> saveToken(TokenGestionBancario token) {

        return iTokenGestionBancarioRepository.save(token)
                .map(savedToken -> true) // Si se guarda exitosamente, retorna true
                .onErrorReturn(false); // Si hay un error, retorna false
    }
    @Override
    public Mono<TokenGestionBancario> getTokenGestionBancarioByCode(Long idUser, String codeToken) {
        return iTokenGestionBancarioRepository.findTokenByIdUserAndCodeToken(idUser.intValue(), codeToken);
    }
}
