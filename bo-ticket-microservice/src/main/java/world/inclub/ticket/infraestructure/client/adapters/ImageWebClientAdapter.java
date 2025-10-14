package world.inclub.ticket.infraestructure.client.adapters;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import world.inclub.ticket.application.port.CloudStorageService;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class ImageWebClientAdapter implements CloudStorageService {

    @Qualifier("documentWebClient")
    private final WebClient documentWebClient;

    @Override
    public Mono<String> save(FilePart filePart, String folderNumber) {
        return documentWebClient.post()
                .contentType(org.springframework.http.MediaType.MULTIPART_FORM_DATA)
                .body(BodyInserters.fromMultipartData("file", filePart).with("folderNumber", folderNumber))
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> response.get("data").toString())
                .onErrorMap(e -> new RuntimeException("No se pudo subir el archivo a S3", e));
    }

    @Override
    public Mono<String> saveMultiPart(MultipartFile file, String folderNumber) {
        return documentWebClient.post()
                .contentType(org.springframework.http.MediaType.MULTIPART_FORM_DATA)
                .body(BodyInserters.fromMultipartData("file", file.getResource()).with("folderNumber", folderNumber))
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> response.get("data").toString())
                .onErrorMap(e -> new RuntimeException("No se pudo subir el archivo a S3", e));
    }

}
