package world.inclub.transfer.liquidation.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.api.dtos.UserAccountDto;
import world.inclub.transfer.liquidation.domain.entity.UserCustomer;

public interface IUserCustomerService {

    public Mono<UserCustomer> saveUserCustomer(UserAccountDto entity);
    Mono<UserCustomer> getFindById(Integer id);
    Mono<UserCustomer> updateByUsername(String username, world.inclub.transfer.liquidation.api.dtos.UserUpdateDto payload);

}
