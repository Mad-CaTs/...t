package world.inclub.membershippayment.infraestructure.apisExternas.documentImage;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.netty.channel.ChannelOption;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;
import world.inclub.membershippayment.crosscutting.exception.core.ExternalApiException;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;

@Slf4j
@Component
public class ExternalAPIClient {

    @Value("${api.document.url}")
    private String urlDocument;

    public Mono<String> postDataToExternalAPI(MultipartFile file, String folderNumber) throws IOException {

        // Configurar el HttpClient con tiempo de espera de 1 minuto
        HttpClient httpClient = HttpClient.create()
                .responseTimeout(Duration.ofMinutes(1)) // Tiempo de espera de 1 minuto para la respuesta
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 60000); // Tiempo de espera para la conexión (60 segundos)

        // Crear el WebClient con el HttpClient configurado
        WebClient webClient = WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();

        String apiUrl = urlDocument;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        return webClient.post()
                .uri(apiUrl)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(BodyInserters.fromMultipartData("file", new ByteArrayResource(file.getBytes()) {
                            @Override
                            public String getFilename() {
                                return file.getOriginalFilename();
                            }
                        })
                        .with("folderNumber", folderNumber))
                .retrieve()
                .bodyToMono(String.class)
                .map(response -> {
                    try {
                        // Convertir la respuesta JSON a un objeto Java
                        ObjectMapper mapper = new ObjectMapper();
                        Map<String, Object> jsonResponse = mapper.readValue(response, Map.class);

                        // Obtener la URL de la imagen de la propiedad "data"
                        String imageUrl = (String) jsonResponse.get("data");
                        return imageUrl;
                    } catch (IOException e) {
                        e.printStackTrace();
                        throw new RuntimeException("Error al procesar la respuesta JSON", e);
                    }
                }).onErrorResume(e -> {
                    log.error("Error while calling external API S3", e);
                    return Mono.error(new ExternalApiException("Error while calling external API S3",e));
                });

    }
}

