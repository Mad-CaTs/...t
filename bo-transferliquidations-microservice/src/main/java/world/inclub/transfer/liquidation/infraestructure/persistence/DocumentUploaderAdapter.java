package world.inclub.transfer.liquidation.infraestructure.persistence;

import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.domain.port.DocumentUploaderPort;

@Component
@RequiredArgsConstructor
@Slf4j
public class DocumentUploaderAdapter implements DocumentUploaderPort {

    private final WebClient documentWebClient;
    private final Environment env;

    @Override
    public Mono<String> uploadFile(FilePart file, String folderNumber) {
        try {
            MultipartBodyBuilder builder = new MultipartBodyBuilder();
        String filename = file.filename() != null ? file.filename() : "file";
        MediaType contentType = file.headers().getContentType();
        String contentTypeValue = contentType != null ? contentType.toString() : MediaType.APPLICATION_OCTET_STREAM_VALUE;
        builder.part("file", file).filename(filename)
            .header("Content-Type", contentTypeValue);
            builder.part("folderNumber", folderNumber);

            log.info("Preparando solicitud de subida de archivo:");
            log.info(" - Nombre del archivo: {}", filename);
            log.info(" - Tipo de contenido: {}", contentType);
            log.info(" - folderNumber: {}", folderNumber);

            String baseUrl = env.getProperty("api.document.url");
            log.info("Documento - usando api.document.url={}", baseUrl);

            WebClient.RequestBodySpec requestSpec = documentWebClient.post().uri("/s3");

            return requestSpec
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(BodyInserters.fromMultipartData(builder.build()))
                    .exchangeToMono(response -> {
                        if (response.statusCode().is2xxSuccessful()) {
                            return response.bodyToMono(String.class)
                                    .doOnNext(url -> log.info("✅ Archivo subido correctamente. URL devuelta: {}", url));
                        } else {
                            return response.bodyToMono(String.class)
                                    .defaultIfEmpty("<empty response>")
                                    .flatMap(body -> {
                                        String msg = "Document service error: " + response.statusCode() + " - " + body;
                                        log.error("❌ Error desde el servicio de documentos. status={} body={}", response.statusCode(), body);
                                        return Mono.error(new world.inclub.transfer.liquidation.infraestructure.exception.DocumentServiceException(msg));
                                    });
                        }
                    })
                    .doOnSubscribe(s -> log.info("Enviando archivo al servicio de documentos..."));

        } catch (Exception e) {
            log.error("❌ Excepción inesperada al subir archivo: {}", e.getMessage(), e);
            return Mono.error(new RuntimeException("Error uploading file to S3", e));
        }
    }
}
