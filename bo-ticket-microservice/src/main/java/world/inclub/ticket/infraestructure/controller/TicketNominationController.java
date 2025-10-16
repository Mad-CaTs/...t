package world.inclub.ticket.infraestructure.controller;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import world.inclub.ticket.application.dto.UpdateAttendeesCommand;
import world.inclub.ticket.application.port.ticket.TicketNominationService;
import world.inclub.ticket.infraestructure.config.handler.ResponseHandler;
import world.inclub.ticket.infraestructure.controller.dto.NominationBatchRequest;
import world.inclub.ticket.infraestructure.controller.dto.UserPurchaseRequest;
import world.inclub.ticket.infraestructure.controller.mapper.NominationBatchRequestMapper;
import world.inclub.ticket.utils.PageableUtils;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/ticket/nomination")
public class TicketNominationController {

    private final TicketNominationService ticketNominationService;
    private final NominationBatchRequestMapper nominationBatchRequestMapper;

    @PostMapping("/status")
    public Mono<ResponseEntity<Object>> getStatus(@RequestBody @Valid UserPurchaseRequest request) {
        Pageable pageable = PageableUtils.createPageable(request.pagination(), "created_at");
        return ResponseHandler.generateResponse(
                HttpStatus.OK,
                ticketNominationService.getUserPaymentsWithNominationStatus(request.userId(), pageable),
                true);
    }

    @PostMapping
    public Mono<ResponseEntity<Object>> nominate(@RequestBody @Valid NominationBatchRequest request) {
        UpdateAttendeesCommand command = nominationBatchRequestMapper.toCommand(request);
        return ResponseHandler.generateResponse(HttpStatus.CREATED, ticketNominationService.nominateTicket(command), true);
    }

}
