package world.inclub.transfer.liquidation.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.application.service.interfaces.IAcountService;
import world.inclub.transfer.liquidation.domain.entity.Account;
import world.inclub.transfer.liquidation.domain.entity.Socio;
import world.inclub.transfer.liquidation.domain.entity.Three;
import world.inclub.transfer.liquidation.domain.port.AccountPort;
import world.inclub.transfer.liquidation.domain.port.IThreePort;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AccountServiceImpl implements IAcountService {

    private final AccountPort accountPort; 
    private final IThreePort threePort; 

    @Override
    public Mono<Account> getAccountById(Integer id) {
        return accountPort.findById(id);
    }

    @Override
    public Mono<Account> getAccountByUsername(String username) {
        return accountPort.findByUsername(username); 
    }

    @Override
    public Mono<Account> findSponsorByParentId(Integer parentId) {
        return getAccountById(parentId);
    }

    @Override
    public Mono<Account> findSponsorByUsername(String username) {
        return getAccountByUsername(username);
    }

    @Override
    public Mono<Account> resolveSponsor(Integer transferType, Integer idUser, String sponsorUsername) {
        return resolveSponsor(transferType, idUser, sponsorUsername, null);
    }


    @Override
    public Mono<Account> resolveSponsor(Integer transferType, Integer idUser, String sponsorUsername, Integer sponsorId) {
        if (transferType == null) return Mono.empty();

        return switch (transferType) {
            // Types 1,2 and 4 resolve by traversing the sponsor tree using idUser
            case 1, 2, 4 -> {
                if (idUser == null) yield Mono.empty();
                Mono<Three> treeMono = (sponsorId != null)
                        ? threePort.findSponsorByIdMaster(sponsorId)
                        : threePort.findAllSponsorTrees()
                            .filter(tree -> tree != null && tree.getData() != null)
                            .filter(tree -> containsUser(tree.getData(), idUser))
                            .next();
                yield treeMono.flatMap(tree -> {
                    if (tree == null || tree.getData() == null) {
                        log.warn("Sponsor tree vacío o nulo para idUser={} (sponsorId={})", idUser, sponsorId);
                        return Mono.empty();
                    }
                    Integer parentIdTmp = findParentId(tree.getData(), idUser);
                    if (parentIdTmp == null) {
                        boolean isTopLevel = tree.getData().stream().anyMatch(s -> s.getIdsocio().equals(idUser));
                        if (isTopLevel) parentIdTmp = tree.getIdsociomaster();
                    }
                    final Integer resolvedParentId = parentIdTmp;
                    log.debug("Resolved parentId={} para idUser={} (sponsorId={})", resolvedParentId, idUser, sponsorId);
                    return (resolvedParentId != null)
                            ? findSponsorByParentId(resolvedParentId)
                                .doOnNext(acc -> log.debug("Cuenta patrocinador encontrada: {} (id={})", acc.getUsername(), acc.getId()))
                                .switchIfEmpty(Mono.defer(() -> {
                                    log.warn("No existe Account para parentId={}", resolvedParentId);
                                    return Mono.empty();
                                }))
                            : Mono.empty();
                });
            }
            // Type 3 resolves directly by sponsor username
            case 3 -> {
                if (sponsorUsername == null || sponsorUsername.isBlank()) {
                    log.debug("resolveSponsor: type=3 but sponsorUsername was null/blank");
                    yield Mono.empty();
                }
                log.debug("resolveSponsor: resolving by username='{}'", sponsorUsername);
                yield findSponsorByUsername(sponsorUsername)
                        .doOnNext(acc -> log.debug("resolveSponsor: found account by username='{}' -> id={}", sponsorUsername, acc.getId()))
                        .switchIfEmpty(Mono.defer(() -> {
                            log.warn("resolveSponsor: no account found for username='{}'", sponsorUsername);
                            return Mono.empty();
                        }));
            }
            default -> Mono.empty();
        };
    }

    private Integer findParentId(List<Socio> socios, Integer targetId) {
        for (Socio socio : socios) {
            if (socio.getChildren() != null) {
                for (Socio child : socio.getChildren()) {
                    if (child.getIdsocio().equals(targetId)) {
                        return socio.getIdsocio();
                    }
                }
                Integer found = findParentId(socio.getChildren(), targetId);
                if (found != null) return found;
            }
        }
        return null;
    }

    private boolean containsUser(List<Socio> socios, Integer targetId) {
        if (socios == null) return false;
        for (Socio socio : socios) {
            if (socio.getIdsocio() != null && socio.getIdsocio().equals(targetId)) {
                return true;
            }
            if (socio.getChildren() != null && !socio.getChildren().isEmpty()) {
                if (containsUser(socio.getChildren(), targetId)) return true;
            }
        }
        return false;
    }
}