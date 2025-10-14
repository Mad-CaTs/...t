package world.inclub.ticket.application.port;

import reactor.core.publisher.Mono;

public interface GenerateQrService {

    /**
     * Generates a qr code with an embedded logo.
     *
     * @param data    the data to encode in the qr code
     * @return a Mono emitting the generated qr code as a byte array
     */
    Mono<byte[]> generateQr(Object data);

}
