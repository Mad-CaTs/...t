package world.inclub.ticket.application.port;

import org.springframework.http.codec.multipart.FilePart;
import reactor.core.publisher.Mono;

public interface VoucherStorageService {

    Mono<String> saveVoucher(FilePart filePart);

}
