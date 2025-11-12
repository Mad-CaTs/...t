package world.inclub.transfer.liquidation.domain.port;

import org.springframework.http.codec.multipart.FilePart;

import reactor.core.publisher.Mono;

public interface DocumentUploaderPort {
    Mono<String> uploadFile(FilePart file, String folderNumber);
}
