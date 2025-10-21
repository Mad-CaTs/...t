package world.inclub.bonusesrewards.shared.utils.filestorage.infrastructure;

import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.http.MediaType;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.utils.filestorage.domain.model.FileResource;

import java.util.Optional;

@Component
public class FilePartAdapter {

    public Mono<FileResource> from(FilePart filePart) {
        if (filePart == null) return Mono.empty();

        return DataBufferUtils.join(filePart.content())
                .map(dataBuffer -> {
                    byte[] bytes = new byte[dataBuffer.readableByteCount()];
                    dataBuffer.read(bytes);
                    DataBufferUtils.release(dataBuffer);

                    long sizeBytes = bytes.length;
                    String mimeType = Optional.ofNullable(filePart.headers().getContentType())
                            .map(MediaType::toString)
                            .orElse("application/octet-stream");

                    return new FileResource(filePart.filename(), bytes, sizeBytes, mimeType);
                });
    }

}

