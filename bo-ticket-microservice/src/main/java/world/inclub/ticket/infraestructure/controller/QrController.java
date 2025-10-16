package world.inclub.ticket.infraestructure.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import world.inclub.ticket.application.port.ticket.TicketAvailabilityService;
import world.inclub.ticket.infraestructure.config.handler.ResponseHandler;
import world.inclub.ticket.infraestructure.controller.dto.QrRequest;
import world.inclub.ticket.infraestructure.controller.dto.UpdateQrRequest;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/qr")
public class QrController {

    private final TicketAvailabilityService ticketAvailabilityService;

    @PostMapping
    public Mono<ResponseEntity<Object>> getData(@RequestBody QrRequest request) {
        return ResponseHandler.generateResponse(HttpStatus.OK, ticketAvailabilityService.validateQr(request.qrHash()), true);
    }

    @PostMapping("/update/status")
    public Mono<ResponseEntity<Object>> updateStatus(@RequestBody UpdateQrRequest request) {
        return ResponseHandler.generateResponse(HttpStatus.OK, ticketAvailabilityService.updateQrStatus(request.ticketUuid(), request.status()), true);
    }

}
