package world.inclub.ticket.application.service.interfaces;

import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.infraestructure.controller.dto.PageResponse;
import world.inclub.ticket.infraestructure.controller.dto.UserPurchaseResponse;
import world.inclub.ticket.infraestructure.controller.dto.UserPurchaseRequest;

public interface GetUserPurchasesUseCase {

    /**
     * Retrieves a paginated list of user purchases.
     *
     * @param userId   the ID of the user whose purchases are to be retrieved
     * @param pageable pagination information
     * @return a Mono emitting a PageResponse containing UserPurchaseResponse objects
     */
    Mono<PageResponse<UserPurchaseResponse>> getUserPurchasesPaginated(Long userId, Pageable pageable);

}
