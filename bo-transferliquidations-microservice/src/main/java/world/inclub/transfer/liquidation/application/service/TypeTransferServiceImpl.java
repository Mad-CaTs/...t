package world.inclub.transfer.liquidation.application.service;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.application.service.interfaces.ITypeTransferService;
import world.inclub.transfer.liquidation.domain.entity.TypeTransfer;
import world.inclub.transfer.liquidation.domain.port.ITypeTransferPort;
import world.inclub.transfer.liquidation.application.service.interfaces.IAcountService;
import world.inclub.transfer.liquidation.application.service.interfaces.IMembershipService;
import world.inclub.transfer.liquidation.infraestructure.exception.common.ResourceNotFoundException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TypeTransferServiceImpl implements ITypeTransferService {

    private final ITypeTransferPort iport;
    private final IAcountService accountService;
    private final IMembershipService membershipService;
    private final UserService userService;

    @Override
    public Flux<TypeTransfer> getAllTransfer() {
        return iport.getAllTypeTransfer();
    }

    @Override
    public Mono<List<Map<String, Object>>> getFilteredTransferTypes(Integer idUser, String username, Integer requestedType) {
        Flux<Map<String, Object>> mapped = getAllTransfer()
                .map(tt -> {
                    Map<String, Object> m = new java.util.HashMap<>();
                    m.put("id", tt.getIdTypeTransfer());
                    m.put("name", tt.getName());
                    m.put("description", tt.getDescription());
                    return m;
                });

        if ((idUser == null || idUser <= 0) && (username == null || username.isBlank())) {
            return mapped.collectList();
        }

        Mono<world.inclub.transfer.liquidation.domain.entity.Account> accountMono =
                (idUser != null && idUser > 0) ? accountService.getAccountById(idUser) : accountService.getAccountByUsername(username == null ? null : username.trim());

        return accountMono.flatMap(acc -> {
            if (acc == null) return Mono.error(new ResourceNotFoundException("Usuario no encontrado"));

            Mono<Boolean> hasMultiMono = userService.hasMultiAccounts(acc.getId() == null ? null : acc.getId().longValue());
            // Check if the account is a child (part of a multicodigo)
            Mono<Boolean> isChildMono = userService.isChildAccount(acc.getId() == null ? null : acc.getId().longValue());
        // Count only "active" membership packages (status == 1). Types 3 and 4 require more than one active membership.
        Mono<Boolean> hasMoreMembershipMono = membershipService
            .getMembershipsByUserId(acc.getId())
            .flatMapIterable(m -> m.getMembership())
            .filter(p -> p != null && p.getStatus() != null && p.getStatus().intValue() == 1)
            .count()
            .map(c -> c > 1L)
            .defaultIfEmpty(false);

            return Mono.zip(hasMultiMono, hasMoreMembershipMono, isChildMono)
                    .flatMap(tuple -> {
                        boolean hasMulti = tuple.getT1();
                        boolean hasMore = tuple.getT2();
                        boolean isChild = tuple.getT3();

                        Flux<Map<String, Object>> filtered = mapped.filter(m -> {
                            Object idObj = m.get("id");
                            if (!(idObj instanceof Number)) return true;
                            int id = ((Number) idObj).intValue();
                            // transfer types 3 and 4 require more active memberships
                            if ((id == 3 || id == 4) && !hasMore) return false;
                            // type 1 is not allowed from a multicódigo account: either parent (hasMulti) or child (isChild)
                            if ((isChild || hasMulti) && id == 1) return false;
                            // type 2 (multicódigo) is only available for accounts that have multicuentas
                            if (id == 2 && !hasMulti) return false;
                            return true;
                        });

                        // If an explicit requestedType is provided, validate against child/multi rules
                        if (requestedType != null) {
                            // both types 3 and 4 require more than one active membership
                            if ((requestedType == 3 || requestedType == 4) && !hasMore) {
                                return Mono.error(new ResponseStatusException(HttpStatus.FORBIDDEN, "Hemos detectado que usted cuenta con menos de una membresía activa, por lo tanto, no es posible realizar este tipo de solicitud de traspaso.\n\nLe recordamos que se requiere un mínimo de dos (2) membresías para acceder a esta funcionalidad."));
                            }

                            // Block transfer type 1 for multicódigo accounts (parent or child)
                            if ((isChild || hasMulti) && requestedType == 1) {
                                return Mono.error(new ResponseStatusException(HttpStatus.FORBIDDEN, "Lo sentimos\n\nUsted posee varias cuentas (multicódigo), por lo que esta opción está disponible únicamente para usuarios con una cuenta normal.\n\nLe invitamos a realizar el traspaso a su cuenta multicódigo para continuar."));
                            }

                            // Type 2 requires the account to have multicuentas (hasMulti)
                            if (requestedType == 2 && !hasMulti) {
                                return Mono.error(new ResponseStatusException(HttpStatus.FORBIDDEN, "Lo sentimos\n\nUsted posee una cuenta normal, por lo que esta opción está disponible únicamente para usuarios con una cuenta multicódigo.\n\nLe invitamos a realizar el traspaso a su cuenta normal para continuar."));
                            }

                            return filtered.filter(m -> {
                                        Object idObj = m.get("id");
                                        return idObj instanceof Number && ((Number) idObj).intValue() == requestedType.intValue();
                                    })
                                    .collectList()
                                    .flatMap(list -> {
                                        if (list.isEmpty()) return Mono.error(new ResourceNotFoundException("Tipo de traspaso solicitado no existe"));
                                        return Mono.just(list);
                                    });
                        }

                        return filtered.collectList().flatMap(list -> {
                            if (list.isEmpty()) {
                                if (!hasMore) {
                                    return Mono.error(new ResponseStatusException(HttpStatus.FORBIDDEN, "Hemos detectado que usted cuenta con menos de una membresía activa, por lo tanto, no es posible realizar este tipo de solicitud de traspaso.\n\nLe recordamos que se requiere un mínimo de dos (2) membresías para acceder a esta funcionalidad."));
                                }
                                if (hasMulti || isChild) {
                                    return Mono.error(new ResponseStatusException(HttpStatus.FORBIDDEN, "Lo sentimos\n\nUsted posee varias cuentas (multicódigo), por lo que esta opción está disponible únicamente para usuarios con una cuenta normal.\n\nLe invitamos a realizar el traspaso a su cuenta multicódigo para continuar."));
                                }
                                return Mono.error(new ResponseStatusException(HttpStatus.FORBIDDEN, "El usuario no tiene permisos para realizar ningún tipo de traspaso"));
                            }
                            return Mono.just(list);
                        });
                    });
        });
    }

}
