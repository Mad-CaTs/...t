package world.inclub.ticket.infraestructure.repository;

import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.domain.model.Users;
import world.inclub.ticket.domain.repository.UsersRepository;
import world.inclub.ticket.api.mapper.UsersMapper;
import world.inclub.ticket.infraestructure.persistence.SpringDataR2dbcUsersRepository;
import world.inclub.ticket.domain.entity.UsersEntity;

@Repository
public class R2dbcUsersRepository implements UsersRepository {

    private final SpringDataR2dbcUsersRepository repository;
    private final UsersMapper mapper;

    public R2dbcUsersRepository(SpringDataR2dbcUsersRepository repository, UsersMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Mono<Users> save(Users user) {
        UsersEntity entity = mapper.toEntity(user);
        return repository.save(entity)
                .map(mapper::toDomain);
    }

    @Override
    public Flux<Users> findAll() {
        return repository.findAll()
                .map(mapper::toDomain);
    }

    @Override
    public Mono<Users> findById(Integer id) {
        return repository.findById(id)
                .map(mapper::toDomain);
    }

    @Override
    public Mono<Void> deleteById(Integer id) {
        return repository.deleteById(id);
    }

    @Override
    public Mono<Boolean> existsById(Integer id) {
        return repository.existsById(id);
    }

    @Override
    public Mono<Users> findByDocumentTypeAndDocumentNumber(Integer documentTypeId, String documentNumber) {
        return repository.findByDocumentTypeIdAndDocumentNumber(documentTypeId, documentNumber)
                .map(mapper::toDomain);
    }

    public Mono<Users> findByUsername(String username) {
        return repository.findByUsername(username)
                .map(mapper::toDomain);
    }

    public Mono<Users> findByPhone(String phone) {
        return repository.findByPhone(phone)
                .map(mapper::toDomain);
    }

    @Override
    public Mono<Users> findByDocumentNumber(String documentNumber) {
        return repository.findByDocumentNumber(documentNumber)
                .map(mapper::toDomain);
    }

    @Override
    public Mono<Users> findByEmail(String email) {
        return repository.findByEmail(email).map(mapper::toDomain);
    }

}