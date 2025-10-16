package world.inclub.ticket.application.port.ticket;

import reactor.core.publisher.Mono;

public interface TicketStorageService {

    Mono<String> saveTicket(byte[] filePart);

}
