package world.inclub.transfer.liquidation.application.service;

import org.springframework.stereotype.Service;
import org.springframework.http.codec.multipart.FilePart;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.domain.port.DocumentUploaderPort;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class UploadDocumentService {

    private final DocumentUploaderPort documentUploaderPort;

    public Mono<String> uploadImage(FilePart file, String folderNumber) {
        return documentUploaderPort.uploadFile(file, folderNumber);
    }

    public Mono<List<String>> uploadImages(Flux<FilePart> files, String folderNumber) {
        return files.flatMap(file -> documentUploaderPort.uploadFile(file, folderNumber))
                .collectList();
    }
}