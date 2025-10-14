package world.inclub.ticket.infraestructure.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import world.inclub.ticket.infraestructure.controller.dto.UserPurchaseRequest;
import world.inclub.ticket.application.service.interfaces.GetUserPurchasesUseCase;
import world.inclub.ticket.infraestructure.config.handler.ResponseHandler;
import world.inclub.ticket.utils.PageableUtils;

@Slf4j
@RestController
@RequestMapping("/api/v1/user/purchases")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserPurchaseController {

    private final GetUserPurchasesUseCase getUserPurchasesUseCase;

    @PostMapping("/")
    public Mono<ResponseEntity<Object>> getUserPurchases(@RequestBody @Valid UserPurchaseRequest request) {
        Pageable pageable = PageableUtils.createPageable(request.pagination(), "created_at");
        return ResponseHandler.generateResponse(HttpStatus.OK, getUserPurchasesUseCase.getUserPurchasesPaginated(request.userId(), pageable), true);
    }
}
