package world.inclub.ticket.infraestructure.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;
import world.inclub.ticket.application.port.ticket.TicketService;
import world.inclub.ticket.infraestructure.config.handler.ResponseHandler;
import world.inclub.ticket.infraestructure.controller.dto.TicketEventsRequest;
import world.inclub.ticket.utils.PageableUtils;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/tickets")
public class TicketController {

    private final TicketService ticketService;

    @PostMapping("/events")
    public Mono<ResponseEntity<Object>> getTicketsByEventId(@RequestBody @Valid TicketEventsRequest request) {
        Pageable pageable = PageableUtils.createPageable(request.pagination(), "created_at");
        return ResponseHandler.generateResponse(HttpStatus.OK, ticketService.getTicketsByEventId(request.eventId(), request.status(), pageable), true);
    }

}
