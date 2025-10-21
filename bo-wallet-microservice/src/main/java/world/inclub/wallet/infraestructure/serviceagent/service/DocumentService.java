package world.inclub.wallet.infraestructure.serviceagent.service;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class DocumentService {

    @Qualifier("documentWebClient")
    private final WebClient documentWebClient;

    public Mono<String> postDataToExternalAPI(Mono<FilePart> file, String folderNumber) {
        log.info("postDataToExternalAPI - folderNumber={}", folderNumber);

        return file.flatMap(f -> {
            MultipartBodyBuilder bodyBuilder = new MultipartBodyBuilder();
            bodyBuilder.part("file", f).contentType(MediaType.MULTIPART_FORM_DATA);
            bodyBuilder.part("folderNumber", folderNumber);

            return documentWebClient.post()
                    .uri("/api/v1/s3")
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(BodyInserters.fromMultipartData(bodyBuilder.build()))
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, response ->
                            response.bodyToMono(String.class).flatMap(errorBody -> {
                                log.error("Error desde S3 API: status={} body={}", response.statusCode(), errorBody);
                                return Mono.error(new RuntimeException("S3 API Error: " + errorBody));
                            })
                    )
                    .bodyToMono(String.class)
                    .map(response -> {
                        try {
                            log.debug("Respuesta cruda de S3 API: {}", response);
                            // Convertir la respuesta JSON a un objeto Java
                            ObjectMapper mapper = new ObjectMapper();
                            Map<String, Object> jsonResponse = mapper.readValue(response, Map.class);

                            // Obtener la URL de la imagen de la propiedad "data"
                            String imageUrl = (String) jsonResponse.get("data");
                            log.info("Link del documento guardado: {}", imageUrl);
                            return imageUrl;
                        } catch (IOException e) {
                            log.error("Error al procesar la respuesta JSON", e);
                            throw new RuntimeException("Error al procesar la respuesta JSON", e);
                        }
                    })
                    .onErrorResume(e -> {
                        log.error("Error while calling external API S3", e);
                        return Mono.error(new RuntimeException("Error while calling external API S3", e));
                    });
        });
    }
}
