package world.inclub.ticket.infraestructure.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import world.inclub.ticket.application.service.interfaces.GetUserTicketsUseCase;
import world.inclub.ticket.domain.model.EventStatus;
import world.inclub.ticket.infraestructure.config.handler.ResponseHandler;
import world.inclub.ticket.infraestructure.controller.dto.PaginationRequest;
import world.inclub.ticket.utils.PageableUtils;

@RestController
@RequestMapping("/api/v1/user/tickets")
@RequiredArgsConstructor
public class UserTicketController {

    private final GetUserTicketsUseCase getUserTicketsUseCase;

    @PostMapping("/{userId}/{status}")
    public Mono<ResponseEntity<Object>> getUserTickets(
            @PathVariable(value = "userId") Long userId,
            @PathVariable(value = "status") EventStatus status,
            @RequestBody @Valid PaginationRequest pagination) {
        Pageable pageable = PageableUtils.createPageable(pagination, "created_at");
        return ResponseHandler.generateResponse(HttpStatus.OK, getUserTicketsUseCase.getUserTickets(userId, status, pageable), true);
    }

    @PostMapping("/details/{paymentId}")
    public Mono<ResponseEntity<Object>> getUserTicketsDetails(
            @PathVariable(value = "paymentId") Long paymentId,
            @RequestBody @Valid PaginationRequest pagination) {
        Pageable pageable = PageableUtils.createPageable(pagination, "created_at");
        return ResponseHandler.generateResponse(HttpStatus.OK, getUserTicketsUseCase.getUserTicketsDetails(paymentId, pageable), true);
    }

}
