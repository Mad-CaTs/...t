package world.inclub.wallet.bankAccountWithdrawal.application.processor;

import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DefaultDataBufferFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.codec.multipart.FilePart;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.nio.file.Files;
import java.nio.file.Path;

public class InMemoryFilePart implements FilePart {

    private final String filename;
    private final byte[] content;

    public InMemoryFilePart(String filename, byte[] content) {
        this.filename = filename;
        this.content = content;
    }

    @Override
    public String filename() {
        return filename;
    }

    @Override
    public Mono<Void> transferTo(Path dest) {
        try {
            Files.write(dest, content);
            return Mono.empty();
        } catch (Exception e) {
            return Mono.error(e);
        }
    }

    @Override
    public String name() {
        return "file";
    }

    @Override
    public HttpHeaders headers() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentDispositionFormData("file", filename);
        headers.setContentType(MediaType.TEXT_PLAIN);
        headers.setContentLength(content.length);
        return headers;
    }

    @Override
    public Flux<DataBuffer> content() {
        DataBuffer buffer = new DefaultDataBufferFactory().wrap(content);
        return Flux.just(buffer);
    }
}
