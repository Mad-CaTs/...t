package world.inclub.bonusesrewards.shared.utils.filestorage.infrastructure;

import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.utils.filestorage.domain.model.FileResource;

@Component
public class FilePartAdapter {

    public Mono<FileResource> from(FilePart filePart) {
        if (filePart == null) return Mono.empty();

        return Mono.from(
                DataBufferUtils.join(filePart.content())
        ).map(dataBuffer -> {
            byte[] bytes = new byte[dataBuffer.readableByteCount()];
            dataBuffer.read(bytes);
            DataBufferUtils.release(dataBuffer);
            return new FileResource(filePart.filename(), bytes);
        });
    }

}

