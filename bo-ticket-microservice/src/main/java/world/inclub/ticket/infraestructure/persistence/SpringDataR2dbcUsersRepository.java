package world.inclub.ticket.infraestructure.persistence;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.entity.UsersEntity;

public interface SpringDataR2dbcUsersRepository extends ReactiveCrudRepository<UsersEntity, Integer> {
    Mono<UsersEntity> findByDocumentTypeIdAndDocumentNumber(Integer documentTypeId, String documentNumber);
    Mono<UsersEntity> findByDocumentNumber(String documentNumber);
    Mono<UsersEntity> findByEmail(String email);
    Mono<UsersEntity> findByUsername(String username);
    Mono<UsersEntity> findByPhone(String phone);
}