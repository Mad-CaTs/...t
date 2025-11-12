package world.inclub.transfer.liquidation.application.service.interfaces;

import java.util.Map;
import java.util.List;

import org.springframework.http.ResponseEntity;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.domain.entity.User;
import world.inclub.transfer.liquidation.domain.entity.UserCustomer;

public interface IUserService {

    Flux<User> findAllUsers(); // Devuelve todos los usuarios

    Mono<User> findById(Integer id); // Busca un usuario por su ID, puede emitir 0 o 1 resultado

    Mono<User> findUserByUserName(String userName); // Busca un usuario por su nombre de usuario

    Mono<Boolean> existsUserById(Integer idUser); // Indica si existe un usuario con ese ID (true/false)

    Mono<User> saveUser(User user); // Guarda o actualiza un usuario, devolviendo el guardado

    Mono<Void> delete(User user); // Elimina el usuario, completa sin devolver nada

    Mono<User> updateUserByUsername(String username, String name, String lastName, Integer idState, Boolean isPromoter,
            String newUsername);

    Mono<ResponseEntity<Map<String, String>>> updateUser(
            String username,
            UserCustomer updatedUser,
            Integer transferType,
            Integer multiCode,
            Integer idMembership);

                Flux<Map<String, Object>> getEnrichedMultiAccountsByParentId(Long parentId);

                Mono<List<Map<String, Object>>> getEnrichedSubscriptionsByUsername(String username);
}
