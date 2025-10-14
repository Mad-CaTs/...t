package world.inclub.bonusesrewards.shared.utils.filestorage.infrastructure;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.utils.filestorage.domain.model.FileContext;
import world.inclub.bonusesrewards.shared.utils.filestorage.domain.model.FileResource;
import world.inclub.bonusesrewards.shared.utils.filestorage.domain.port.FileStoragePort;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class FileStorageService
        implements FileStoragePort {
    private final WebClient documentWebClient;
    private final StorageProperties storageProperties;

    @Override
    public Mono<String> save(FileResource file, FileContext context) {
        ByteArrayResource resource = createResource(file);
        return documentWebClient.post()
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(BodyInserters.fromMultipartData("file", resource)
                              .with("folderNumber", getFolder(context)))
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> response.get("data").toString())
                .onErrorMap(e -> new RuntimeException("No se pudo subir el archivo a S3", e));
    }

    private String getFolder(FileContext context) {
        return switch (context) {
            case QUOTATION -> storageProperties.quotationsFolder();
            case DOCUMENT -> storageProperties.documentsFolder();
            case VOUCHER -> storageProperties.vouchersFolder();
            case CAR_IMAGE -> storageProperties.carsFolder();
        };
    }

    private ByteArrayResource createResource(FileResource file) {
        return new ByteArrayResource(file.content()) {
            @Override
            public String getFilename() {
                return file.filename();
            }
        };
    }
}
