package world.inclub.transfer.liquidation.infraestructure.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.domain.entity.UserCustomer;


public interface IUserCustomerRepository extends ReactiveCrudRepository<UserCustomer, Integer> {
    // The UserCustomer entity is mapped to schema "bo_account" and table "user".
    // Use explicit schema-qualified references to avoid querying the wrong schema.
    @Query("SELECT * FROM bo_account.\"user\" WHERE id = :id")
    Mono<UserCustomer> getFindById(@Param("id") Integer id );

    @Query("SELECT * FROM bo_account.\"user\" WHERE username = :username")
    Mono<UserCustomer> findByUsername(@Param("username") String username);
}
