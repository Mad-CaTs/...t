package world.inclub.transfer.liquidation.domain.port;

import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.domain.entity.UserCustomer;

public interface IUserCustomerPort {
	Mono<UserCustomer> saveUserCustomer(UserCustomer entity);
	Mono<UserCustomer> updateUserCustomer(int userCustomerId, final Mono<UserCustomer> userCustomerMono);
	Mono<UserCustomer> getFindById(Integer id);
	Mono<UserCustomer> findByUsername(String username);
}
