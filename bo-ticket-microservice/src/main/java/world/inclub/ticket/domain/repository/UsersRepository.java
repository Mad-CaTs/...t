package world.inclub.ticket.domain.repository;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.model.Users;

public interface UsersRepository {
    Mono<Users> save(Users user);
    Flux<Users> findAll();
    Mono<Users> findById(Integer id);
    Mono<Void> deleteById(Integer id);
    Mono<Boolean> existsById(Integer id);
    Mono<Users> findByEmail(String email);
    Mono<Users> findByDocumentNumber(String documentNumber);
    Mono<Users> findByDocumentTypeAndDocumentNumber(Integer documentTypeId, String documentNumber);
    Mono<Users> findByUsername(String username);
    Mono<Users> findByPhone(String phone);
}